import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Page from '#models/page'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class Block extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ isPrimary: true })
  declare componentId: number

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare content: object // Assuming content is stored as JSONB

  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
