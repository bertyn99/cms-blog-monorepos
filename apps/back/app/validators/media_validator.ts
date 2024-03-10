import vine from '@vinejs/vine'


export const addMediaValidator = vine.compile(
    vine.object({
        folder: vine.string(),
        medias: vine.array(
            vine.file({
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'pdf']
            })
        ).nullable()
    })
)