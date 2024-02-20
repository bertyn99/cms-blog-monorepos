import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest } from 'nitropack';
export type Post = {
    id: number;
    title: string;
    postId?: number;
    content: string;
    published: boolean;
    locale: string;
    status: Role;
    createdAt: Date;
    updatedAt: Date;
}

type PostList = {
    meta: {
        total: number,
        perPage: number,
        currentPage: number,
        lastPage: number,
        firstPage: number,
        firstPageUrl: string,
        lastPageUrl: string,
        nextPageUrl: null | string,
        previousPageUrl: null | string,
    }
    data: Post[]
}
export const postRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({

    async getAllPostBylocal(options?: any) {
        console.log('fetching posts', fetch<PostList>('/posts/', options));
        return fetch<PostList>('/posts/', options);
    },

    async deletePost(id: number) { },
    async createPost(post: Post) { },

    async geTPostContentByLocale(id: number, locale: string) {
        return fetch<Post>(`/posts/${id}/${locale}`);
    }
})