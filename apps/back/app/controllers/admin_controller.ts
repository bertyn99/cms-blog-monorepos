import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AAdminController {
  constructor(protected userService: UserService) {}

  async getAll({ response }: HttpContext) {
    const users = await this.userService.getAllUsers()
    return response.ok(users)
  }

  async getUser({ params, response }: HttpContext) {
    const user = await this.userService.getUserById(params.id)
    return response.ok(user)
  }

  async updateUser({ request, params, response }: HttpContext) {
    const user = await this.userService.updateUserById(params.id, request.body())
    return response.ok(user)
  }

  async deleteUser({ params, response }: HttpContext) {
    const user = await this.userService.deleteUserById(params.id)
    return response.ok(user)
  }
}
