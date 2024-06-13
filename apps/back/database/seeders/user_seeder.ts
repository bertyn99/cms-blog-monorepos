import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'
import Hash from '@adonisjs/core/services/hash'
export default class UserSeeder extends BaseSeeder {
  async run() {
    const roles = await Role.all()

    const usersData: { [key: string]: { fullName: string; email: string } } = {
      user: { fullName: 'John Doe', email: 'user@cms.com' },
      author: { fullName: 'Jane Smith', email: 'author@cms.com' },
      editor: { fullName: 'Robert Johnson', email: 'editor@cms.com' },
      admin: { fullName: 'Alice Williams', email: 'admin@cms.com' },
    }

    for (const role of roles) {
      const userData = usersData[role.name]
      if (userData) {
        await role.related('users').create({
          fullName: userData.fullName,
          email: userData.email,
          password: 'secret',
          avatar: null,
          bio: `This is a ${role.name} user.`,
        })
      }
    }
  }
}
