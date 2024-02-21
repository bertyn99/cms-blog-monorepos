import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest } from 'nitropack';
import type { Post, PostList } from '@yggdra/shared';

export const postRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({

    async getAllPostBylocal(options?: any) {
        console.log('fetching posts', fetch<PostList>('/posts/', options));
        return fetch<PostList>('/posts/', options);
    },

    async deletePost(id: number) { },
    async createPost(post: Post) { },

    async getPostContentByLocale(id: number, locale: string) {
        return fetch<Post>(`/posts/${id}/${locale}`);
    }
})