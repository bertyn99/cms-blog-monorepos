import type { HttpContext } from '@adonisjs/core/http'
import { inject } from "@adonisjs/core";
import PostService from '#services/post_service';
import { request } from 'node:http';
import {
  newPostTranslationValidator,
} from '#validators/post_validator'
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
  async store({ params, request, response }: HttpContext) {

    const data = request.all()
    try {
      const payload = await newPostTranslationValidator.validate(data);
      const { seo, ...postData } = payload;

      if (postData.postId) {

        const newPostTranslation = await this.postService.createPostTranslation(postData, seo);
        return newPostTranslation;
      } else {
        const newPost = await this.postService.createPost(postData, seo);
        return newPost;
      }

    }
    catch (error) {
      return response.status(error.status).send({ error: error.message })
    }



    /* const post = await this.postService.createPost(data, data.local);
    return post; */

  }

  /**
   * Return Post ConTent
   */
  async showPostContent({ params, response }: HttpContext) {
    try {
      const { id, local } = params;
      const postContent = await this.postService.getContentPostById(id, local);
      return postContent;
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

  /**
 * Information about the post  and his translations
 */
  async showPost({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const post = await this.postService.getPostById(id);

      return post;
    } catch (error) {

      return response.status(error.status).send({ error: error.message })
    }
  }


  /**
   * Update individual record of postTranslation
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.all();
    try {
      const { id } = params;
      const payload = await newPostTranslationValidator.validate(data);
      const { seo, ...updatedPostData } = payload;
      const post = await this.postService.updatePostTranslationById(id, updatedPostData, seo);
      return post;
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const post = await this.postService.deletePostById(id);
      return response.ok({ message: 'Post deleted' });
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

  async destroyTranslation({ params, response }: HttpContext) {
    try {
      const { id, locale } = params;
      const post = await this.postService.deletePostTranslationById(id, locale);
      return response.ok({ message: `Post ${id} Translation ${locale} deleted` });
    } catch (error) {
      return response.status(error.status).send({ error: error.message })
    }
  }

}