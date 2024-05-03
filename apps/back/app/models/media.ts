import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Folder from '#models/folder'
export default class Media extends BaseModel {
  public static table = 'medias'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare file_path: string

  @column()
  declare file_name: string

  // Foreign key is still on the same model
  @column()
  declare folderId: number

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @column()
  declare mime_type: string

  @column()
  declare size: number

  @column()
  declare alt: string | null // Alt attribute for the image

  @column()
  declare caption: string | null // Caption for the image

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
