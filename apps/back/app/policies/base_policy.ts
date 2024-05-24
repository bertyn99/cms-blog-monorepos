import User from '#models/user'
import Base from '#models/base'
import { BasePolicy as BouncerBasePolicy } from '@adonisjs/bouncer'
import type { Role } from '@yggdra/shared'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

let UserRole: Role
export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User | null) {
    if (user?.role === UserRole.ADMIN) {
      return true
    }
  }
}
