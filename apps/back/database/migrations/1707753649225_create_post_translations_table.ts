import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE')
      table.string('locale', 2).notNullable().defaultTo('fr') // ISO 639-1 language codes (e.g., 'en', 'fr')
      table.string('title').notNullable()
      table.string('slug').nullable().unique() // Optional, for translated slugs
      table.string('description').nullable()
      table.text('content').notNullable()
      table.timestamp('scheduled_for').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}