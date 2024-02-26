import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

export default function userRoutes() {
    router
        .group(() => {
            router.get('/me', [AuthController, 'getMe'])
        }).use(middleware.auth())
        .prefix('/users')
}