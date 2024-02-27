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
    async getPostById(id: number) {
        console.log('id', id)
        const post = await Post.query()
            .where('id', id)
            .preload('translations')
            .first();
        return post;

    }
    async getContentPostById(id: number, local: string) {
        const postTranslation = await PostTranslation.query().where('postId', id).where('locale', local).preload('seo').first();
        return postTranslation?.toJSON();

    }
    async getPostBySlug(slug: string) {
        const post = await Post.query()
            .whereHas('translations', (translationQuery) => {
                translationQuery.where('slug', slug);
            })
            .first();
        return post;
    }

    async getAllPosts(filters: any = {}, page: number = 1, limit: number = 10) {
        const postsPagination = await Post.query()
            .preload('translations', (translationQuery) => {
                translationQuery.if(filters.locale, (query) => query.where('locale', filters.locale), () => { })
            })
            .paginate(page, limit);


        const tmp = postsPagination.toJSON()
        const transformedData = tmp.data.map(post => post.translations.map(translation => ({
            ...translation.toJSON(),
            status: post.status
        })));
        return {
            ...tmp,
            data: transformedData.flat()
        };

    }
}