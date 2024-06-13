import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AdminController = () => import('#controllers/admin_controller')

export default function userRoutes() {
  router
    .group(() => {
      router.get('/', [AdminController, 'getAll'])
      router.get('/:id', [AdminController, 'getUser'])
      router.put('/role', [AdminController, 'changeUsersRole'])
      router.put('/:id', [AdminController, 'updateUser'])
      router.delete('/:id', [AdminController, 'deleteUser'])
    })
    .use(middleware.auth())
    .prefix('/users')
}
