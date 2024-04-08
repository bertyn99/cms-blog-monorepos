import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import Folder from '#models/folder'
import Media from '#models/media'
import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import * as fs from 'fs'
import { promisify } from 'util'

@inject()
export default class MediaLibrairyService {
  async saveFile(file: MultipartFile, folderPath: string | null): Promise<Media | any> {
    try {
      if (!file) {
        throw new Error('File not found')
      }

      // Set folderId based on folderPath
      let folder: Folder | null = null
      if (folderPath) {
        folder = await Folder.firstOrCreate({ path: folderPath }, { name: folderPath })
        console.log('Folder:', folder)
      }

      const fileName = `${cuid()}_${file.clientName}`
      // Save media details to the database
      const media = new Media()
      media.file_name = fileName
      media.mime_type = file.extname ?? ''
      media.size = file.size
      media.file_path = `uploads/${fileName}`
      if (folder !== null) await media.related('folder').associate(folder)
      await media.save()

      // Move the file to the uploads directory

      await file.move(app.publicPath('uploads'), {
        name: fileName,
        overwrite: true,
      })

      if (file.state !== 'moved') {
        throw new Error('File move operation failed')
      }

      return media
    } catch (error) {
      console.error('Error saving file:', error)
      return { error: error.message }
    }
  }
  async getAllMediaGroupedByFolder(filter: any): Promise<
    {
      folder: string
      files: string[]
    }[]
  > {
    const allMedia = await Media.query()
      .select('folder', 'file_name')
      .if(filter.folder, (query) => {
        query.where('folder', 'LIKE', `%${filter.folder}/%`).andWhere('folder', '!=', filter.folder) // if condition met
      })

    // Organize media into folders
    const mediaByFolder: { folder: string; files: string[] }[] = []

    allMedia.forEach((media) => {
      const folderPath = media.folder || 'default' // Use 'default' if folder is null or empty

      // Check if the folder is the specified parent folder
      if (folderPath === filter.folder) {
        return // Skip the parent folder
      }
      const relativeFolder = filter.folder
        ? folderPath.substring(filter.folder.length + 1)
        : folderPath
      const folderKey = relativeFolder.split('/')[0] || 'default' // Use 'default' if no folder is specified

      // Check if the folder is already in the result array
      const folderIndex = mediaByFolder.findIndex((item) => item.folder === folderKey)
      if (folderIndex !== -1) {
        // Add the file to the existing folder
        mediaByFolder[folderIndex].files.push(media.file_name)
      } else {
        // Create a new folder object
        mediaByFolder.push({ folder: folderKey, files: [media.file_name] })
      }
    })
    // Filter out the 'default' folder
    const filteredMediaByFolder = mediaByFolder.filter((item) => item.folder !== 'default')

    return filteredMediaByFolder
  }

  async getAllMedia(queryParams: { folder?: string; orderBy?: string }): Promise<Media[]> {
    let query = Media.query()

    if (queryParams.folder) {
      query = query.where('folder', queryParams.folder)
    }

    if (queryParams.orderBy) {
      const [column, direction] = queryParams.orderBy.split(':')
      query = query.orderBy(column, direction as 'asc' | 'desc')
    }

    return query
  }

  async getMediaById(id: number): Promise<Media | null> {
    return Media.find(id)
  }

  async updateMedia(id: number, data: HttpContextContract['request']): Promise<Media | null> {
    const media = await Media.findOrFail(id)

    media.merge({
      file_name: data.input('file_name'),
      mime_type: data.input('mime_type'),
      size: data.input('size'),
      folder: data.input('folder'),
    })

    await media.save()

    return media
  }

  async deleteMedia(arrId: number[]): Promise<void> {
    try {
      //remove the file from the disk
      arrId.forEach(async (id) => {
        const media = await Media.find(id)
        if (media) {
          const formatPath = media.file_path == 'default' ? '' : media.file_path
          const path = app.publicPath(formatPath)

          //check if the file exists
          if (await this.fileExists(path)) {
            await this.removeFile(path)
            await media.delete()
          }
        }
      })
    } catch (error) {}
  }
  async deleteAListofFolderMedia(arrFolder: string[]): Promise<void> {
    try {
      arrFolder.forEach(async (folder) => {
        await this.deleteFolderMedia(folder)
      })
    } catch (error) {
      throw error
    }
  }

  async deleteFolderMedia(folder: string): Promise<void> {
    try {
      //get all the media in the folder
      const medias = await Media.query().where('folder', folder)

      //check if the folder exists or if it has any media
      if (medias.length === 0) {
        throw new Error('Folder not found')
      }
      medias.forEach(async (media) => {
        //create the path to the file
        const formatPath = media.file_path == 'default' ? '' : media.file_path
        const path = app.publicPath(formatPath)

        //check if the file exists
        if (await this.fileExists(path)) {
          await this.removeFile(path)
          await media.delete()
        }
      })

      //remove the folder from the disk
      const folderPath = app.publicPath(`uploads/${folder}`)
      if (await this.fileExists(folderPath)) {
        await this.removeAFolder(folderPath)
      }
    } catch (error) {
      throw error
    }
  }

  async removeFile(filePath: string): Promise<void> {
    const unlinkAsync = promisify(fs.unlink)

    try {
      await unlinkAsync(filePath)
      console.log('File was deleted')
    } catch (err) {
      console.error('Error deleting file:', err)
    }
  }
  private async removeAFolder(folderPath: string): Promise<void> {
    const rmdirAsync = promisify(fs.rmdir)

    try {
      await rmdirAsync(folderPath, { recursive: true })
      console.log('Folder was deleted')
    } catch (err) {
      console.error('Error deleting folder:', err)
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    const accessAsync = promisify(fs.access)

    try {
      await accessAsync(filePath, fs.constants.F_OK)
      return true
    } catch (err) {
      return false
    }
  }

  private async moveDiskFolder(oldFolderPath: string, newFolderPath: string): Promise<void> {
    // Ensure the old folder exists on disk
    const oldFolderExists = await this.fileExists(oldFolderPath)

    if (oldFolderExists) {
      // Rename the old folder to the new path
      await fs.promises.rename(oldFolderPath, newFolderPath)
    }
  }

  private async moveFile(oldFilePath: string, newFilePath: string): Promise<void> {
    // Ensure the old file exists on disk
    const oldFileExists = await this.fileExists(oldFilePath)

    if (oldFileExists) {
      // Move the old file to the new path
      const newFolder = app.publicPath(newFilePath)

      // Ensure the new folder exists, create it if not
      await fs.promises.mkdir(newFolder, { recursive: true })

      // Move the file
      await fs.promises.rename(oldFilePath, newFilePath)
    }
  }

  // Function to create folder if it doesn't exist
  private async createFolderIfNotExist(folderPath) {
    try {
      // Check if folder exists
      const folderExists = await fs.promises.access(folderPath, fs.constants.F_OK)

      // If folder exists, return
      if (!folderExists) {
        return
      }

      // If folder doesn't exist, create it
      await fs.promises.mkdir(folderPath, { recursive: true })
      console.log(`Folder created at ${folderPath}`)
    } catch (error) {
      console.error(`Error creating folder: ${error}`)
    }
  }
}
