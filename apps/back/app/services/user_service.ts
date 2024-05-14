import { inject } from '@adonisjs/core'
import User from '#models/user'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
@inject()
export default class UserService {
  constructor() {}

  async createUser(data: any) {
    try {
      const user = await User.create(data)

      //send a mail through a mail service

      return user
    } catch (error) {
      if (error.code === '23505') {
        return { error: 'Email already exists' }
      } else return { error: error }
    }
  }

  async login(data: any, auth: any) {
    const user = await User.verifyCredentials(data.email, data.password)

    if (!user) {
      return { error: 'Invalid credentials' }
    }
    try {
      await auth.use('web').login(user)

      return {
        message: 'Logged in successfully',
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateUserById(id: number, data: any, avatar?: any) {
    const user = await User.find(id)
    user?.merge(data)
    console.log(avatar)
    if (avatar) {
      let uid = null
      let f = null
      if (user?.avatar) {
        uid = user.avatar.split('_')[0]
        f = await this.uploadAvatar(avatar, uid)
      } else {
        f = await this.uploadAvatar(avatar)
      }

      user?.merge({ avatar: f })
    }
    return await user?.save()
  }

  async deleteUserById(id: number) {
    const user = await User.find(id)
    return await user?.delete()
  }

  async getUserById(id: number) {
    try {
      return await User.find(id)
    } catch (error) {
      throw new Error('User not found')
    }
  }

  async getAllUsers() {
    return await User.all()
  }

  async uploadAvatar(avatar: MultipartFile, id?: string) {
    try {
      if (!avatar) {
        throw new Error('File not found')
      }

      const fileName = `${id ? id : cuid()}_user_avatar.${avatar.extname}`
      // Move the file to the uploads directory

      await avatar.move(app.publicPath('uploads/avatar'), {
        name: fileName,
        overwrite: true,
      })

      if (avatar.state !== 'moved') {
        throw new Error('File move operation failed')
      }

      return fileName
    } catch (error) {
      console.error('Error saving file:', error)
      return { error: error.message }
    }
  }
}
