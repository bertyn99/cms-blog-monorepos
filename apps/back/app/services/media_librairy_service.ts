import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import Folder from '#models/folder'
import Media from '#models/media'
import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import * as fs from 'fs'
import { promisify } from 'util'

import { ModelObject } from '@adonisjs/lucid/types/model'
import { Exception } from '@adonisjs/core/exceptions'
import { IUpdateMediaValidator } from '#validators/media_validator'

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
  async getAllFolder(filter: any): Promise<Folder[]> {
    const folders = await Folder.query()
      .select('id', 'name', 'path')
      .if(
        filter.folder,
        (query) => {
          query.where('path', 'LIKE', `${filter.folder}/%`)
        },
        (query) => {
          query.whereNull('parentId')
        }
      )
      .withAggregate('media', (query) => {
        query.count('*').as('mediaCount')
      })
      .paginate(filter.page ?? 1, filter.limit ?? 10)

    return folders
  }

  async getAllMedia(
    queryParams: {
      folder: string | null
      orderBy: string | null
      page: number
      limit: number
    } = {
      folder: null,
      orderBy: null,
      page: 1,
      limit: 10,
    }
  ): Promise<{
    meta: any
    data: ModelObject[]
  }> {
    const medias = await Media.query()
      .if(queryParams.folder, (query) => {
        if (queryParams.folder == '/') {
          return query.whereNull('folder_id')
        } else {
          query.whereHas('folder', (folderQuery) => {
            return folderQuery.where('path', queryParams.folder ?? '')
          })
        }
      })
      .if(queryParams.orderBy, (query) => {
        const [column, direction] = queryParams.orderBy?.split(':') ?? []
        query.orderBy(column, direction as 'asc' | 'desc')
      })
      .paginate(queryParams.page ?? 1, queryParams.limit ?? 10)

    return medias.toJSON()
  }

  async getMediaById(id: number): Promise<Media | null> {
    try {
      return await Media.findOrFail(id)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND' || error.code === 'E_MISSING_DATABASE_ROW')
        throw new Exception('Error this Media was not found', {
          code: 'MEDIA_NOT_FOUND',
          status: 404,
        })
    }
  }

  async createFolder(folder: any, parentId: number) {
    try {
      // Check if folder exists
      const folderExists = await Folder.query()
        .where('name', folder)
        .whereHas('parent', (query) => {
          query.where('id', parentId)
        })
        .first()

      if (folderExists) {
        throw new Error('Folder already exists')
      }

      const newFolder = new Folder()
      newFolder.name = folder
      newFolder.path = ''
      if (parentId !== null) {
        const parentFolder = await Folder.find(parentId)
        if (!parentFolder) throw new Error('Parent folder not found')

        await newFolder.related('parent').associate(parentFolder)
      }

      await newFolder.save()
      return newFolder
    } catch (error) {
      console.error('Error creating folder:', error)
      throw new Error('Error creating folder')
    }
  }

  async updateMedia(id: number, data: Partial<IUpdateMediaValidator>): Promise<Media | null> {
    const media = await Media.findOrFail(id)
    const { folderId, ...rest } = data
    if (data.folderId !== undefined) {
      media.merge(rest)
    }

    if (folderId && media.folderId !== folderId) {
      console.log('Sans folder:', folderId !== null)
      const folder = await Folder.findOrFail(folderId)
      await media.related('folder').associate(folder)
    }

    await media.save()

    return media
  }

  async deleteMedia(arrId: number[]): Promise<void> {
    try {
      //remove the file from the disk
      arrId.forEach(async (id) => {
        const media = await Media.find(id)
        if (media) {
          const formatPath = media.file_path
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
  async deleteAListofFolderMedia(arrFolder: number[]): Promise<void> {
    try {
      arrFolder.forEach(async (folder) => {
        await this.deleteFolderMedia(folder)
      })
    } catch (error) {
      throw error
    }
  }

  async deleteFolderMedia(folderId: number): Promise<void> {
    try {
      //get all the media in the folder
      const folder = await Folder.find(folderId)

      //check if the folder exists or if it has any media
      if (folder === null) {
        throw new Error('Folder not found')
      }

      //delete all the media in the folder
      const medias = await folder.related('media').query().select('id')

      console.log('Medias:', medias)

      //extract the media ids
      const mediaIds = medias.map((media) => media.id)

      //delete the media
      await this.deleteMedia(mediaIds)

      //delete the folder
      await folder.delete()

      //remove the folder from the disk
      /*   const folderPath = app.publicPath(`uploads/${folder}`)
      if (await this.fileExists(folderPath)) {
        await this.removeAFolder(folderPath)
      } */
    } catch (error) {
      throw error
    }
  }

  async moveMedia(mediaIds: number[], folderId: number): Promise<void> {
    const destinationFolder = await Folder.find(folderId)

    //loop through the media ids
    mediaIds.forEach(async (id) => {
      const media = await Media.find(id)
      if (media) {
        if (destinationFolder) {
          await media.related('folder').associate(destinationFolder)
        }

        await media.save()
      }
    })
  }
  async moveFolderMedia(folderIds: number[], destinationFolderId: any) {
    const destinationFolder = await Folder.find(destinationFolderId)

    //loop through the folder ids
    folderIds.forEach(async (folderId) => {
      //get the folder
      const folder = await Folder.find(folderId)
      if (folder) {
        //get the destination folder

        if (destinationFolder && folder.parentId !== destinationFolder.id) {
          //associate the folder with the destination folder
          await folder.related('parent').associate(destinationFolder)
        }
        if (destinationFolder === null) {
          await folder.related('parent').dissociate()
        }

        await folder.save()
      }
    })
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
