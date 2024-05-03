import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const addMediaValidator = vine.compile(
  vine.object({
    folder: vine.string(),
    medias: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'pdf'],
        })
      )
      .nullable(),
  })
)

export const updateMediaValidator = vine.compile(
  vine.object({
    file_name: vine.string(),
    file_path: vine.string(),
    alt: vine.string().nullable(),
    caption: vine.string().nullable(),
    folderId: vine.number().nullable(),
  })
)

export type IUpdateMediaValidator = Infer<typeof updateMediaValidator>
