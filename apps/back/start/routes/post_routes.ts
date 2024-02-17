import router from '@adonisjs/core/services/router'
const PostController = () => import('#controllers/posts_controller')

export default function postRoutes() {

    router.group(() => {
        router.get('/posts', [PostController, 'index'])
        router.get('/posts/:local', [PostController, 'listFilteredByLocal'])
        router.post('/posts/:local?', [PostController, 'store'])
        router.get('/posts/:local/:id', [PostController, 'show'])
        /*  router.get('/posts/:id/edit', [PostController,'edit'])
         router.put('/posts/:id', PostController,'update')
         router.delete('/posts/:id', PostController,'destroy') */

    }).prefix('/posts')
}
