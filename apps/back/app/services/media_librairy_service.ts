import { inject } from "@adonisjs/core";
import db from '@adonisjs/lucid/services/db'
import Media from "#models/media";

@inject()
export default class MediaLibrairyService {

    public async saveFile(file: any, folderPath: string): Promise<Media> {
        const media = new Media()
        media.file_name = `${cuid()}_${file.clientName}`
        media.mime_type = file.extname
        media.size = file.size

        if (folderPath) {
            media.folder = folderPath
        }

        await file.move(MediaServer.publicPath('uploads'), {
            name: media.file_name,
            overwrite: true,
        })

        if (!file.moved()) {
            throw new Error('File move operation failed')
        }

        await media.save()

        return media
    }
    public async getAllMediaGroupedByFolder(): Promise<Record<string, string[]>> {
        const allMedia = await Media.query().select('folder', 'file_name')

        // Organize media into folders
        const mediaByFolder = allMedia.reduce((result: any, media) => {
            const folderPath = media.folder || 'default' // Use 'default' if folder is null or empty
            const folders = folderPath.split('/') // Split nested folders

            // Create nested structure
            let currentFolder = result
            folders.forEach(folder => {
                currentFolder[folder] = currentFolder[folder] || {}
                currentFolder = currentFolder[folder]
            })

            // Add file to current folder
            currentFolder.files = currentFolder.files || []
            currentFolder.files.push(media.file_name)

            return result
        }, {})

        return mediaByFolder
    }
    public async getAllMedia(): Promise<Media[]> {
        return Media.all()
    }

    public async getMediaById(id: number): Promise<Media | null> {
        return Media.find(id)
    }

    public async updateMedia(id: number, data: HttpContextContract['request']): Promise<Media | null> {
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

    public async deleteMedia(id: number): Promise<void> {
        const media = await Media.findOrFail(id)

        await media.delete()
    }
}

