import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('file_path').notNullable()
      table.string('file_name').notNullable()
      table.string('mime_type').notNullable()
      table.integer('folder_id').unsigned().references('folders.id').onDelete('CASCADE')
      table.integer('size').unsigned().notNullable()
      table.string('alt').nullable()
      table.string('caption').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
