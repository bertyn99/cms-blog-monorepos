import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PostController = () => import('#controllers/posts_controller')

export default function postRoutes() {

    router.group(() => {
        router.get('/', [PostController, 'index'])
        router.get('/:id', [PostController, 'showPost']).where('id', {
            match: /^[0-9]+$/,
        })
        router.get('/:id/:local', [PostController, 'showPostContent']).where('id', {
            match: /^[0-9]+$/,
        })

        router.post('/:local?', [PostController, 'store'])


        /*  router.get('/:id/edit', [PostController,'edit'])
         router.put('/:id', PostController,'update')
         router.delete('/:id', PostController,'destroy') */

    }).use(middleware.auth()).prefix('/posts')
}
