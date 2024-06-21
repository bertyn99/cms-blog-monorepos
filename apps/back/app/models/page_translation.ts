import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Page from './page.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PageTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pageId: number

  @column()
  declare lang: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare metadata: object

  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
