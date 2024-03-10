import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import MediaLibrairyService from '#services/media_librairy_service'

@inject()
export default class MediaController {
  constructor(protected mediaService: MediaLibrairyService) {}

  async store({ request, response }: HttpContext) {
    const folder = await request.input('folder')

    const medias = request.files('medias', {
      size: '6mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'avif', 'pdf'],
    })

    if (!medias.length) {
      return response.badRequest({
        message: 'No file uploaded',
      })
    }

    /**
     * Creating a collection of invalid documents
     */
    let invalidMedias = medias.filter((document) => {
      return !document.isValid
    })

    if (invalidMedias.length) {
      return response.badRequest({
        errors: invalidMedias.map((document) => {
          return {
            name: document.clientName,
            errors: document.errors,
          }
        }),
      })
    }
    try {
      for (const media of medias) {
        if (media.isValid) {
          const saveFile = await this.mediaService.saveFile(media, folder)
          console.log(saveFile)
        }
      }

      //if all files state are moved
      if (medias.every((media) => media.state === 'moved')) {
        return response.created({
          message: 'Files uploaded successfully',
        })
      }
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  async listFolder({ request }: HttpContext) {
    const query = request.qs()
    const media = await this.mediaService.getAllMediaGroupedByFolder(query)

    return media
  }

  async listFiles({ request }: HttpContext) {
    const query = request.qs()
    const media = await this.mediaService.getAllMedia(query)

    return media
  }

  async show({ request, params,response }: HttpContext) {}

  async destroy({ request, params,response }: HttpContext) {
    const mediaIds = await request.input('fileIds')
    const folders = await request.input('folders')

    try {
          if (mediaIds.length > 0) {
        //delete media
        const media = await this.mediaService.deleteMedia(mediaIds) 
      }
      if (folders.length > 0) {
        //delete folder
        const folderMedia = await this.mediaService.deleteAListofFolderMedia(folders)
      }

     
    } catch (error) {
      response.status(500).send({ error: 'An error occurred while deleting media' });
    }
  
    return response.status(200).send({ message: 'Media deleted successfully' });
  
  }

  async destroyFolder({ request }: HttpContext) {
    const { folder } = request.qs()

    const media = await this.mediaService.deleteFolderMedia(folder)

    return media
  }
}
