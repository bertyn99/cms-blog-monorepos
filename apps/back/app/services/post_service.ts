
import db from '@adonisjs/lucid/services/db'
import Post from "#models/post";
import PostTranslation from '#models/post_translation';
import PostSeo from '#models/post_seo';
import { Exception } from "@adonisjs/core/exceptions";
import { DateTime } from "luxon";

export default class PostService {

    protected trx: any;
    constructor() {

    }

    async createPost(data: any, seoMeta: any) {
        try {
            this.trx = await db.transaction();

            const post = new Post();
            post.fill(data.post);

            await post.useTransaction(this.trx).save();

            const postTranslation = new PostTranslation();
            postTranslation.fill({ ...data, postId: post.id });
            await postTranslation.useTransaction(this.trx).save();

            if (seoMeta) {
                const postSeo = new PostSeo();
                postSeo.fill({ ...seoMeta, postTranslationId: postTranslation.id });
                await postSeo.useTransaction(this.trx).save();
            }

            await this.trx.commit();

            return postTranslation.toJSON();
        } catch (error) {
            await this.trx.rollback();
            return { error: error.message }
        }
    }

    async createPostTranslation(data: any, seoMeta: any) {
        this.trx = await db.transaction();

        try {
            //find the post by id
            const existingPost = await Post.findOrFail(data.postId);

            const postTranslation = new PostTranslation();
            postTranslation.fill({ ...data, postId: existingPost?.id });
            await postTranslation.useTransaction(this.trx).save();

            if (seoMeta) {
                const postSeo = new PostSeo();
                postSeo.fill({ ...seoMeta, postTranslationId: postTranslation.id });
                await postSeo.useTransaction(this.trx).save();
            }

            await this.trx.commit();

            return postTranslation.toJSON();
        } catch (error) {
            await this.trx.rollback();
            return { error: error.message }
        }

    }
    async updatePostTranslationById(id: number, data: any, seoMeta: any) {
        this.trx = await db.transaction();
        try {
            const postTranslation = await this.getPostTranslationByLocale(id, data.locale);

            if (!postTranslation) {
                return { error: 'Post Translation not found' }
            }
            //update post translation data
            postTranslation.merge(data);
            await postTranslation.useTransaction(this.trx).save();

            if (seoMeta) {
                //update seo meta
                const postSeo = await postTranslation.related('seo').query().first();

                if (postSeo) {
                    postSeo.merge(seoMeta);
                    await postSeo.useTransaction(this.trx).save();
                }
            }
            await this.trx.commit();
            // Load the seo relation
            await postTranslation.load('seo');

            return postTranslation.toJSON();

        } catch (error) {
            await this.trx.rollback();
            return { error: error.message }
        }
    }

    async publishPost(postIds: number[]) {
        try {
        
            return await PostTranslation.query().whereIn('id', postIds).update({ status: 'Published' });

        } catch (error) {
            console.log(error);
            throw new Exception('Error publishing post', {
                code: 'PUBLISH_ERROR',
                status: 500
            })
        }
    }

    async unpublishPost(postIds: []) {
        try {
            return await PostTranslation.query().whereIn('id', postIds).update({ status: 'Draft' });

        } catch (error) {
            console.log(error);
            throw new Exception('Error unpublishing post', {
                code: 'UNPUBLISH_ERROR',
                status: 500
            })
        }
    }
    async schedulePost(postIds: number[], publishAt: string) {
        try {
            return await PostTranslation.query().whereIn('id', postIds).update({ status: 'Scheduled', publishedAt: publishAt });

        } catch (error) {
            console.log(error);
            throw new Exception('Error scheduling post', {
                code: 'SCHEDULE_ERROR',
                status: 500
            })
        }
    }
    async updateScheduledPosts() {
        try { 
            // Get all scheduled posts
            const scheduledPosts = await PostTranslation.query().where('status', 'Scheduled')
            console.log(scheduledPosts.length);
            // Iterate through scheduled posts
            await Promise.all(scheduledPosts.map(async (postTranslation) => {
                const publishAt = postTranslation.publishedAt;
                const now = DateTime.now();

                // Check if the publishAt time has passed
                if (publishAt && publishAt <= now) {
                    // Update status to 'Published'
                    await postTranslation.merge({ status: 'Published' }).save();
                }
            }));

            return scheduledPosts;
        } catch (error) {
            console.error(error);
            throw new Exception('Error scheduling posts', {
                code: 'SCHEDULE_ERROR',
                status: 500
            });
        }
    }
    async deletePostById(id: number) {
        this.trx = await db.transaction();
        try {
            const post = await Post.findOrFail(id);
            await post.useTransaction(this.trx).delete();
            await this.trx.commit();
            return { message: 'Post deleted' };
        } catch (error) {
            await this.trx.rollback();
            return { error: error.message }
        }
    }

    async deletePostTranslationById(id: number, locale: string) {
        this.trx = await db.transaction();
        try {
            //find the postTranslation with a post id and locale
            const postTranslation = await this.getPostTranslationByLocale(id, locale);
            if (!postTranslation) {
                return { error: 'Post Translation not found' }
            }
            //delete the post translation
            await postTranslation.useTransaction(this.trx).delete();
            await this.trx.commit();
            return { message: 'Post Translation deleted' };
        } catch (error) {
            await this.trx.rollback();
            return { error: error.message }
        }
    }

    async deleteListOfPostTranslation(postIds: number[], locale: string) {
        this.trx = await db.transaction();

        try {
            //find the postTranslation with a post id and locale
            const postTranslation = await PostTranslation.query({ client: this.trx })
                .whereIn('id', postIds)
                .where('locale', locale)
                .delete();

            console.log(postTranslation);
            if (postTranslation.length === 0 || postTranslation[0] == 0) {

                throw new Exception('Post Translation not found', {
                    code: 'POST_TRANSLATION_NOT_FOUND',
                    status: 404

                })
            }
            //delete the post translation

            await this.trx.commit();
            return { message: 'Post Translation deleted' };
        } catch (error) {
            await this.trx.rollback();
            throw error
        }
    }

    async getPostById(id: number) {

        const post = await Post.query()
            .where('id', id)
            .preload('translations')
            .first();

        if (!post) {
            throw new Error('Post not found');
        }

        return post;

    }
    async getContentPostById(id: number, local: string) {
        const postTranslation = await this.getPostTranslationByLocale(id, local);
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

    async getPostTranslationByLocale(postId: number, locale: string) {
        const postTranslation = await PostTranslation.query()
            .where('postId', postId)
            .where('locale', locale)
            .preload('seo')
            .first();

        if (!postTranslation) {
            throw new Exception('Post Translation not found', {
                code: 'POST_TRANSLATION_NOT_FOUND',
                status: 404
            });
        }

        return postTranslation;
    }

    async getAllPosts(filters: any = {}, page: number = 1, limit: number = 10) {

        const postTranslations = await PostTranslation.query()
            .if(filters.locale, (query) => query.where('locale', filters.locale), () => { })
            .orderBy('id', 'asc')
            .paginate(page, limit);

            return postTranslations.toJSON();

    }
}