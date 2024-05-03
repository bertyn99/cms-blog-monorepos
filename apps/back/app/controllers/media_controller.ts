import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import MediaLibrairyService from '#services/media_librairy_service'
import { updateMediaValidator } from '#validators/media_validator'

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
        msg: 'No file uploaded',
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
        }
      }

      //if all files state are moved
      if (medias.every((media) => media.state === 'moved')) {
        return response.created({
          msg: 'Files uploaded successfully',
        })
      }
    } catch (error) {
      return response.badRequest({
        msg: error.message,
      })
    }
  }

  async update({ request, params, response }: HttpContext) {
    const mediaId = await params.mediaId
    const data = request.all()
    const payload = await updateMediaValidator.validate(data)

    try {
      const media = await this.mediaService.updateMedia(mediaId, payload)

      return media
    } catch (error) {
      console.error('Error updating media:', error)
      return response.status(error.status).send({ error: error.message })
    }
  }

  async move({ request, response }: HttpContext) {
    const destinationFolderId = await request.input('destinationFolderId')
    const mediaIds = await request.input('mediaIds')
    const folderIds = await request.input('folderIds')

    try {
      if (destinationFolderId || folderIds) {
        if (mediaIds.length > 0) {
          const mediasModed = await this.mediaService.moveMedia(mediaIds, destinationFolderId)
        }

        if (folderIds.length > 0) {
          const mediaFolder = await this.mediaService.moveFolderMedia(
            folderIds,
            destinationFolderId
          )
        }

        return response.status(200).send({ msg: 'Media Moved successfully' })
      }
    } catch (error) {
      console.error('Error moving media:', error)
      return response.status(error.status).send({ error: error.message })
    }
  }

  async storeFolder({ request, response }: HttpContext) {
    const folder = await request.input('name')
    const parentFolderId = await request.input('parent')
    console.log(folder, parentFolderId)
    try {
      const newFolder = await this.mediaService.createFolder(folder, parentFolderId)

      return newFolder
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

  async listFolder({ request }: HttpContext) {
    const query = request.qs()
    const media = await this.mediaService.getAllFolder(query)

    return media
  }

  async listFiles({ request }: HttpContext) {
    const query = request.qs()
    const media = await this.mediaService.getAllMedia(query)

    return media
  }

  async show({ request, params, response }: HttpContext) {
    try {
      const media = await this.mediaService.getMediaById(params.id)

      return media
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

  async destroy({ request, params, response }: HttpContext) {
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

      return response.status(200).send({ msg: 'Media deleted successfully' })
    } catch (error) {
      response.status(500).send({ error: 'An error occurred while deleting media' })
    }
  }

  async destroyFolder({ request }: HttpContext) {
    const { folder } = request.qs()

    const media = await this.mediaService.deleteFolderMedia(folder)

    return media
  }
}
