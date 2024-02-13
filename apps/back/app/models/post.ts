import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PostTranslation from '#models/post_translation'
export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare status: 'DRAFT' | 'PUBLISHED'

  // Relationship to PostTranslations
  @hasMany(() => PostTranslation)
  declare translations: HasMany<typeof PostTranslation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
