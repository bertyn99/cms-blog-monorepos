import type { HttpContext } from '@adonisjs/core/http'
import { inject } from "@adonisjs/core";
import PostService from '#services/post_service';

@inject()
export default class PostsController {
  constructor(private postService: PostService) {

  }


  /**
 * Display a list of resource
 */
  async index({ params, request }: HttpContext) {
    //get the local from the request
    const filter = request.qs();
    const posts = await this.postService.getAllPosts(filter);
    return posts;

  }

  /**
   * Display form to create a new record
   */
  async create({ }: HttpContext) { }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) { }

  /**
   * Return Post ConTent
   */
  async showPostContent({ params }: HttpContext) {
    const { id, local } = params;
    const postContent = await this.postService.getContentPostById(id, local);
    return postContent;
  }

  /**
 * Information about the post  and his translations
 */
  async showPost({ params }: HttpContext) {
    const { id } = params;
    const post = await this.postService.getPostById(id);
    return post;
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) { }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}