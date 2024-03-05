import type { HttpContext } from '@adonisjs/core/http'
import { inject } from "@adonisjs/core";
import MediaLibrairyService from '#services/media_librairy_service';

@inject()
export default class MediaController {
    constructor(protected mediaService: MediaLibrairyService) { }

    async store({ request, response }: HttpContext) {
        const folder = await request.input('folder')

        const medias = request.files('medias', {
            size: '6mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'avif', 'pdf']
        })

        if (!medias.length) {
            return response.badRequest({
                message: 'No file uploaded'
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
                })
            })
        }
        try {
            for (const media of medias) {
                if (media.isValid) {

                    const saveFile = await this.mediaService.saveFile(media, folder);
                    console.log(saveFile)
                }

            }

            //if all files state are moved
            if (medias.every(media => media.state === 'moved')) {
                return response.created({
                    message: 'Files uploaded successfully'
                })
            }
        } catch (error) {

            return response.badRequest({
                message: error.message
            })
        }

    }



    async index({ request }: HttpContext) {

        const media = await this.mediaService.getAllMediaGroupedByFolder()

        return media
    }

    async show({ request, params }: HttpContext) { }

    async destroy({ request, params }: HttpContext) {
        const mediaId = params.id
        const media = await this.mediaService.deleteMedia(mediaId)

        return media
    }

    async destroyFolder({ request }: HttpContext) {
        const { folder } = request.qs();

        const media = await this.mediaService.deleteFolderMedia(folder)

        return media
    }

}