/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  PostPolicy: () => import('#policies/post_policy'),
  BasePolicy: () => import('#policies/base_policy'),
  AdminPolicy: () => import('#policies/admin_policy')
}
