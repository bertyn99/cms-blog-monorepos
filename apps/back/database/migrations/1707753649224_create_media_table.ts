import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('file_path').notNullable()
      table.string('file_name').notNullable()
      table.string('mime_type').notNullable()
      table.string('folder').notNullable()
      table.integer('size').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}