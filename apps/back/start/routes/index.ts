/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import postRoutes from './post_routes.js'
import authRoutes from './auth_routes.js'
import userRoutes from './user_routes.js'
//health check
router.get('/', async () => {
    return { status: 'ok' }
})
router.group(() => {
    postRoutes()

    authRoutes()

    userRoutes()

}).prefix('api')
