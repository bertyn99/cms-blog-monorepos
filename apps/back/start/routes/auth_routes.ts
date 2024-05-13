import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

export default function authRoutes() {
  router
    .group(() => {
      router.post('/login', [AuthController, 'login'])
      router.post('/logout', [AuthController, 'logout'])
    })
    .prefix('/auth')
}
