import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Page from '#models/page'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class PageVersion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pageId: number

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare payload: any // Assuming content is stored as JSONB

  @column()
  declare metadata: object // Assuming metadata is stored as JSONB

  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>

  @column()
  declare authorId: number

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
