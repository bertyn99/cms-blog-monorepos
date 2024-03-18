import { DateTime } from 'luxon'
import type { HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne, belongsTo } from '@adonisjs/lucid/orm'
import PostSeo from '#models/post_seo'
import Post from '#models/post'
import type { PostStatus } from '@yggdra/shared'

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
  declare slug: string | null

  @column()
  declare description: string | null

  @column()
  declare content: string

  @column()
  declare status: PostStatus

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toFormat("yyyy-MM-dd'T'HH:mm") : value
    },
  })
  declare publishedAt: DateTime | null

  @hasOne(() => PostSeo)
  declare seo: HasOne<typeof PostSeo>

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toFormat("yyyy-MM-dd'T'HH:mm") : value
    },
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toFormat("yyyy-MM-dd'T'HH:mm") : value
    },
  })
  declare updatedAt: DateTime
}
