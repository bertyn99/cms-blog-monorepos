import { DateTime } from 'luxon'
import type { HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne, belongsTo } from '@adonisjs/lucid/orm'
import PostSeo from '#models/post_seo'
import Post from '#models/post'

export default class PostTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  // Relationship to Post
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare locale: string

  @column()
  declare title: string

  @column()
  declare content: string

  @hasOne(() => PostSeo)
  declare seo: HasOne<typeof PostSeo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
