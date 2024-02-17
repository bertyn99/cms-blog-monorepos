import { inject } from "@adonisjs/core";
import db from '@adonisjs/lucid/services/db'
import Post from "#models/post";
import PostTranslation from '#models/post_translation';
import PostSeo from '#models/post_seo';
@inject()
export default class PostService {
    protected trx: any;
    constructor() {

    }

    async createPost(data: any, local: string) {
        try {
            this.trx = await db.transaction();

            const post = new Post();
            post.fill(data.post);
            await post.useTransaction(this.trx).save();

            const postTranslation = new PostTranslation();
            postTranslation.fill({ ...data.translation, postId: post.id, local });
            await postTranslation.useTransaction(this.trx).save();

            if (data.seo) {
                const postSeo = new PostSeo();
                postSeo.fill({ ...data.seo, postTranslationId: postTranslation.id });
                await postSeo.useTransaction(this.trx).save();
            }

            await this.trx.commit();

            return post;
        } catch (error) {
            return { error: error }
        }
    }

    async updatePostById(id: number, data: any) { }
    async deletePostById(id: number) { }
    async getPostById(id: number) { }
    async getAllPosts(local: string) {
        const posts = await Post.query().preload('translations', (translation) => {
            translation.where('locale', local);
        }).exec();
        return posts;
    }
}