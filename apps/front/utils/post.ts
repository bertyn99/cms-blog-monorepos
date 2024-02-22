import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest } from 'nitropack';
import type { Post, PostList } from '@yggdra/shared';

export const postRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({

    async getAllPostBylocal(options?: any) {
        return fetch<PostList>('/posts/', options);
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
        return fetch<Post>(`/posts/${id}/${locale}`);
    }
})