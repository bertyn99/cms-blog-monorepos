import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest } from 'nitropack';
type Post = {
    id: number;
    title: string;
    postId?: number;
    content: string;
    published: boolean;
    locale: string;
    status: Role;
    created_at: Date;
    updated_at: Date;
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

    async getAllPostBylocal(locale: string) {
        return fetch<PostList>('/posts/' + locale);
    }
})