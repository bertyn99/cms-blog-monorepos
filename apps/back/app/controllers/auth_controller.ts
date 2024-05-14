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

  async update({ auth, params, request, response }: HttpContext) {
    const data = request.all()

    const medias = request.files('avatar', {
      size: '6mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'avif', 'pdf', 'txt'],
    })
    if (medias.length > 1) {
      return response.badRequest({
        msg: 'Too much file uploaded',
      })
    }

    const payload = await authValidator.validate(data)

    try {
      console.log(medias)
      const user = await this.userService.updateUserById(auth.user!.id, payload, medias[0])

      return user
    } catch (error) {
      console.log(error)
      return { error: error }
    }
  }

  async logout({ auth }: HttpContext) {
    await auth.use('web').logout()
    return { message: 'Logged out successfully' }
  }
}
