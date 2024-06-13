import User from '#models/user'
import { BasePolicy as BouncerBasePolicy } from '@adonisjs/bouncer'
import { Role } from '@yggdra/shared'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User | null) {
    if (user?.roleId === Role.ADMIN) {
      return true
    }
  }
}
