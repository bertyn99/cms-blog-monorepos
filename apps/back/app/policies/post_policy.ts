import User from '#models/user'
import PostTranslation from '#models/post_translation'

import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import BasePolicy from './base_policy.js'

export default class PostPolicy extends BasePolicy {
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
