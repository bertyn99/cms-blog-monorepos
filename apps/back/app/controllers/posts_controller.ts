import type { HttpContext } from '@adonisjs/core/http'
import { inject } from "@adonisjs/core";
import PostService from '#services/post_service';

@inject()
export default class PostsController {
  constructor(private post: PostService) {

  }
  /**
   * Display a list of resource
   */
  async index({ }: HttpContext) { }


  /**
 * Display a list of resource
 */
  async listFilteredByLocal({ params }: HttpContext) {

    //get the local from the request
    const { local } = params;
    const posts = await this.post.getAllPosts(local);
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
   * Show individual record
   */
  async show({ params }: HttpContext) { }

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