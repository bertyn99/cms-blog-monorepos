import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import Media from '#models/media'
import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import * as fs from 'fs';
import { promisify } from 'util';

@inject()
export default class MediaLibrairyService {
  async saveFile(file: MultipartFile, folderPath: string | null): Promise<Media | any> {
    try {
      if (!file) {
        throw new Error('File not found')
      }

      const media = new Media()
      media.file_name = `${cuid()}_${file.clientName}`
      media.mime_type = file.extname ?? 'default'
      media.size = file.size
      media.file_path = `uploads/`
      console.log(media.file_path)
      if (folderPath) {
        media.folder = folderPath
        media.file_path += `${media.folder}/`
      } else {
        media.folder = 'default'
      }

      await file.move(app.publicPath(media.file_path), {
        name: media.file_name,
        overwrite: true,
      })
      media.file_path += media.file_name

      if (file.state !== 'moved') {
        throw new Error('File move operation failed')
      }

      await media.save()

      return media
    } catch (error) {
      return { error: error.message }
    }
  }
  async getAllMediaGroupedByFolder(filter:any): Promise<Record<string, string[]>> {
    const allMedia = await Media.query().select('folder', 'file_name').if(filter.folder,
      (query) => {
        query.where('folder', 'LIKE', `%${filter.folder}/%`).andWhere('folder', '!=', filter.folder)// if condition met
      } 
    )
  
    // Organize media into folders
    const mediaByFolder: { folder: string; files: string[] }[] = []

    allMedia.forEach((media) => {
      const folderPath = media.folder || 'default' // Use 'default' if folder is null or empty

       // Check if the folder is the specified parent folder
       if (folderPath === filter.folder) {
        return; // Skip the parent folder
      }
      const relativeFolder = filter.folder ? folderPath.substring(filter.folder.length + 1) : folderPath
      const folderKey = relativeFolder.split('/')[0] || 'default' // Use 'default' if no folder is specified

      // Check if the folder is already in the result array
      const folderIndex = mediaByFolder.findIndex(item => item.folder === folderKey)
      if (folderIndex !== -1) {
        // Add the file to the existing folder
        mediaByFolder[folderIndex].files.push(media.file_name)
      } else {
        // Create a new folder object
        mediaByFolder.push({ folder: folderKey, files: [media.file_name] })
      }
    })

    return mediaByFolder
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
          const formatPath=media.file_path=='default'?'':media.file_path
          const path=app.publicPath(formatPath)
          console.log(path)
          console.log(await this.fileExists(path))
          //check if the file exists
         if(await this.fileExists(path)){
          await this.removeFile(path)
          await media.delete()
         }
        }
      })
    } catch (error) {
      
    }
    


  }

  async deleteFolderMedia(folder: string): Promise<void> {
    try {
      const media = await Media.query().where('folder', folder)

      if (media.length === 0) {
        throw new Error('Folder not found')
      }
      await Media.query().where('folder', folder).delete()
    } catch (error) {
      throw error
    }
  }

  async removeFile(filePath: string): Promise<void> {
    const unlinkAsync = promisify(fs.unlink);

    try {
      await unlinkAsync(filePath);
      console.log('File was deleted');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  
  async fileExists(filePath: string): Promise<boolean> {
    const accessAsync = promisify(fs.access);

    try {
      await accessAsync(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
}
