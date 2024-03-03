import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MediaController = () => import('#controllers/media_controller')

export default function authRoutes() {
    router
        .group(() => {

            router.get('/', [MediaController, 'index'])
            router.get('/:id', [MediaController, 'show'])
            router.group(() => {
                router.post('/', [MediaController, 'store'])
                router.delete('/:id', [MediaController, 'destroy'])
                router.delete('/', [MediaController, 'destroyFolder'])
            }).use(middleware.auth())


        }).prefix('media')

}