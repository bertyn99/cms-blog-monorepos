import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_seos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('post_translation_id')
        .unsigned()
        .references('post_translations.id')
        .onDelete('CASCADE')
      table.string('meta_title').nullable()
      table.string('meta_description').nullable()
      table.string('meta_keywords').nullable()
      table.json('structured_data').nullable() // Column for structured data
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
