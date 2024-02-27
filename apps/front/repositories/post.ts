import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import type { Post, PostList } from '@yggdra/shared';

export const postRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({

    async getAllPostBylocal(options?: any) {
        const mergeOptions = {
            credentials: "include", ...options
        };
        return fetch<PostList>('/posts/', mergeOptions);
    },

    async deletePost(id: number) { },
    async createPost(post: Post) { },
    async updatePost(id: number, post: Post) {
        return fetch<Post>(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(post)
        });
    },

    async getPostContentByLocale(id: number, locale: string) {
        const mergeOptions: any = {
            method: 'GET',
            credentials: "include"
        };
        return fetch<Post>(`/posts/${id}/${locale}`,
            mergeOptions);
    }
})