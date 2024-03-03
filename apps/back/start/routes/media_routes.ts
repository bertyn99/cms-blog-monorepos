import router from '@adonisjs/core/services/router'
const MediaController = () => import('#controllers/media_controller')

export default function authRoutes() {
    router
        .group(() => {
            router.post('/', [MediaController, 'store'])
            router.get('/', [MediaController, 'index'])
            router.get('/:id', [MediaController, 'show'])
            router.delete('/:id', [MediaController, 'destroy'])
        }).prefix('media')

}