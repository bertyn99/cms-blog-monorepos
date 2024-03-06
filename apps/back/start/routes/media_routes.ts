import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
const MediaController = () => import('#controllers/media_controller')

export default function authRoutes() {
  router
    .group(() => {
      router.get('/folder', [MediaController, 'listFolder'])
      router.get('/', [MediaController, 'listFiles'])
      router.get('/:id', [MediaController, 'show'])
      router
        .group(() => {
          router.post('/', [MediaController, 'store'])
          router.delete('/:id', [MediaController, 'destroy'])
          router.delete('/', [MediaController, 'destroyFolder'])
        })
        .use(middleware.auth())
    })
    .prefix('media')

  const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  router.get('/uploads/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('public/uploads', normalizedPath)
    console.log(absolutePath, 'absolutePath')
    return response.download(absolutePath)
  })
}
