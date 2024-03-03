import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import MediaLibrairyService from '#services/media_librairy_service';

@inject()
export default class MediaController {
    constructor(protected mediaService: MediaLibrairyService) { }

    async store({ request, response }: HttpContext) {
        const folder = await request.input('folder')

        const medias = request.files('medias', {
            size: '3mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'avif', 'pdf']
        })

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


        for (const media of medias) {
            if (media.isValid) {
                await this.mediaService.saveFile(media, folder);
            }
        }

        //if all files state are moved
        if (medias.every(media => media.state === 'moved')) {
            return response.created({
                message: 'Files uploaded successfully'
            })
        }

    }



    async index({ request }: HttpContext) { }

    async show({ request, params }: HttpContext) { }

    async destroy({ request, params }: HttpContext) { }

}