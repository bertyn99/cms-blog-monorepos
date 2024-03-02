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
    async createPost(post: Post, headers: any) {

        return fetch<Post>('/posts/', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(post)
        });
    },
    async updatePost(id: number, post: Post) {

        return fetch<Post>(`/posts/${id}`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify(post)
        });
    },

    async getPostContentByLocale(id: number, locale: string, headers?: any) {
        const mergeOptions: any = {
            method: 'GET',
            headers,
            credentials: "include"
        };

        /*       console.log(mergeOptions); */
        return fetch<Post>(`/posts/${id}/${locale}`,
            mergeOptions);
    }
})