import router from '@adonisjs/core/services/router'
const PostController = () => import('#controllers/posts_controller')

export default function postRoutes() {

    router.group(() => {
        router.get('/', [PostController, 'index'])
        router.get('/:local', [PostController, 'listFilteredByLocal'])
        router.post('/:local?', [PostController, 'store'])
        router.get('/:local/:id', [PostController, 'show'])
        /*  router.get('/:id/edit', [PostController,'edit'])
         router.put('/:id', PostController,'update')
         router.delete('/:id', PostController,'destroy') */

    }).prefix('/posts')
}
