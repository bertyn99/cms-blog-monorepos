import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Folders extends BaseSchema {
  protected tableName = 'folders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('path').notNullable()
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
