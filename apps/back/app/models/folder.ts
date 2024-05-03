import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, afterSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Media from '#models/media'

export default class Folder extends BaseModel {
  serializeExtras() {
    return {
      mediaCount: Number(this.$extras.mediaCount),
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare path: string

  @column()
  declare parentId: number | null

  @belongsTo(() => Folder, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Folder>

  @hasMany(() => Folder, {
    foreignKey: 'parentId',
  })
  declare subfolders: HasMany<typeof Folder>

  @hasMany(() => Media)
  declare media: HasMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterSave()
  static async generateFolderPath(folder: Folder) {
    if (folder.parentId) {
      await folder.load('parent', (parentQuery) => {
        parentQuery.select('id', 'path')
      })
    }
    if (folder.parent) {
      folder.path = `${folder.parent.path}/${folder.id}`
    } else {
      folder.path = `/${String(folder.id)}`
    }
    await folder.save()
  }
}
