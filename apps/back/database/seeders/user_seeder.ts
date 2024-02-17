import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@blog.com',
        password: 'secret',
      },
    ])
  }
}