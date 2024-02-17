import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PostTranslation from '#models/post_translation'

export default class PostSeo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postTranslationId: number

  @belongsTo(() => PostTranslation)
  declare postTranslation: BelongsTo<typeof PostTranslation>

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column()
  declare metaKeywords: string | null

  @column()
  declare structuredData: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
