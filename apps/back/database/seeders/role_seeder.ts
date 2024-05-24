import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { name: 'user', description: 'Regular user' },
      { name: 'author', description: 'Content creator' },
      { name: 'editor', description: 'Content editor' },
      { name: 'admin', description: 'Administrator' },
    ])
  }
}
