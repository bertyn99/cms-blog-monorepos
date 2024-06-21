import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import AdminUserPolicy from '#policies/admin_policy'
import { updateUserValidator } from '#validators/user_validator'

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

  async changeUsersRole({ bouncer, request, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canChangeUsersRole')
    const data = request.all()
    const { userIds, role } = data

    try {
      await this.userService.changeRole(userIds, role)
      return response.ok({ msg: 'Role changed successfully' })
    } catch (error) {
      return response.badRequest({
        msg: error,
      })
    }
  }

  async updateUser({ bouncer, request, params, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canUpdateUser', params.id)
    const data = request.all()

    const medias = request.file('avatar', {
      size: '6mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'avif', 'pdf', 'txt'],
    })
    /* if (medias.length > 1) {
      return response.badRequest({
        msg: 'Too much file uploaded',
      })
    } */

    const payload = await updateUserValidator.validate(data)

    try {
      const user = await this.userService.updateUserById(params.id, payload, medias)
      return response.ok({ msg: 'User updated successfully' })
    } catch (error) {
      console.log(error)
      return response.badRequest({
        msg: error,
      })
    }
  }

  async deleteUser({ bouncer, params, response }: HttpContext) {
    await bouncer.with(AdminUserPolicy).authorize('canDeleteUser', params.id)

    try {
      const user = await this.userService.deleteUserById(params.id)
      return response.ok({ msg: `User n° ${params.id} deleted successfully` })
    } catch (error) {
      return response.badRequest({
        msg: error,
      })
    }
  }
}
