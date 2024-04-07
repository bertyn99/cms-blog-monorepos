import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE')
      table.string('locale', 2).notNullable().defaultTo('fr') // ISO 639-1 language codes (e.g., 'en', 'fr')
      table.integer('cover_id').unsigned().references('medias.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('slug').nullable().unique() // Optional, for translated slugs
      table.string('description').nullable()
      table.enu('status', ['Draft', 'Scheduled', 'Published'], {
        useNative: true,
        enumName: 'post_translation_status',
        existingType: false,
      })
        .defaultTo('Draft')
      table.dateTime('published_at').nullable()
      table.text('content').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "post_translation_status"')
  }
}
