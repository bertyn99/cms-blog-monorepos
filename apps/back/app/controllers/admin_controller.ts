import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import AdminUserPolicy from '#policies/admin_policy'

@inject()
export default class AAdminController {
  constructor(protected userService: UserService) {}

  async getAll({ bouncer, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canViewListUser')

    const users = await this.userService.getAllUsers()
    return response.ok(users)
  }

  async getUser({ bouncer, params, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canViewUser', params.id)

    const user = await this.userService.getUserById(params.id)
    return response.ok(user)
  }

  async updateUser({ bouncer, request, params, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canUpdateUser', params.id)

    const user = await this.userService.updateUserById(params.id, request.body())
    return response.ok(user)
  }

  async deleteUser({ bouncer, params, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canDeleteUser', params.id)

    const user = await this.userService.deleteUserById(params.id)
    return response.ok(user)
  }
}
