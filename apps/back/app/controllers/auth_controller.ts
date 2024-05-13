import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { authValidator, loginValidator } from '#validators/user_validator'

@inject()
export default class AuthController {
  constructor(protected userService: UserService) {}

  /**
   * register new user
   */
  async register({ request }: HttpContext) {
    const data = request.all()
    const payload = await authValidator.validate(data)

    try {
      const user = await this.userService.createUser(payload)
      return user
    } catch (error) {
      return { error: error }
    }
  }

  /**
   * login user
   */

  async login({ auth, request }: HttpContext) {
    const data = request.all()
    const payload = await loginValidator.validate(data)

    try {
      const user = await this.userService.login(payload, auth)

      return user
    } catch (error) {
      return { error: error }
    }
  }

  async getMe({ auth }: HttpContext) {
    return auth.user
  }

  async update({ auth, params, request }: HttpContext) {
    const data = request.all()
    const payload = await authValidator.validate(data)
    console.log(auth.user)
    try {
      const user = await this.userService.updateUserById(auth.user!.id, payload)

      return user
    } catch (error) {
      return { error: error }
    }
  }

  async logout({ auth }: HttpContext) {
    await auth.use('web').logout()
    return { message: 'Logged out successfully' }
  }
}
