import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import PostTranslation from '#models/post_translation'
import PostSeo from '#models/post_seo'
export default class extends BaseSeeder {
  async run() {
    for (let i = 0; i < 3; i++) {
      // Create a new post
      const post = new Post()
      await post.save()

      // Create a new post translation associated with the post
      const postTranslation = new PostTranslation()
      postTranslation.postId = post.id
      postTranslation.locale = 'fr'
      postTranslation.title = `Title ${i}`
      postTranslation.content = `Content ${i}`
      await postTranslation.save()

      // Create a new post SEO associated with the post translation
      const postSeo = new PostSeo()
      postSeo.postTranslationId = postTranslation.id
      postSeo.metaTitle = `Meta Title ${i}`
      postSeo.metaDescription = `Meta Description ${i}`
      postSeo.metaKeywords = `Meta Keywords ${i}`
      await postSeo.save()
    }
  }

}