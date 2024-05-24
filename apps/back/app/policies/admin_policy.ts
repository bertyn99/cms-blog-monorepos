import User from '#models/user'

import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class AdminUserPolicy extends BasePolicy {
  canViewListUser(user: User): AuthorizerResponse {
    return user.role === 'Admin'
  }

  canViewUser(user: User, targetUser: User): AuthorizerResponse {
    return user.role === 'Admin' || user.id === targetUser?.id
  }

  canCreateUser(user: User): AuthorizerResponse {
    return user.role === 'Admin'
  }

  canUpdateUser(user: User, targetUser: User): AuthorizerResponse {
    return user.role === 'Admin' || user.id === targetUser?.id
  }

  canDeleteUser(user: User, targetUser: User): AuthorizerResponse {
    return user.role === 'Admin' && user.id !== targetUser.id
  }

  canViewListPost(user: User): AuthorizerResponse {
    return user.role === 'Admin'
  }

  canDeletePost(user: User): AuthorizerResponse {
    return user.role === 'Admin' || user.role === 'Editor'
  }

  canCreatePost(user: User): AuthorizerResponse {
    return user.role === 'Admin' || user.role === 'Editor'
  }
}
