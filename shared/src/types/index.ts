export enum Role {
    USER="User",
    ADMIN="Admin",
    EDITOR="Editor"
}

export enum PostStatus {
    DRAFT="Draft",
    PUBLISHED="Published"
}

export type Post = {
    id: number;
    title: string;
    postId?: number;
    content: string;
    slug: string;
    published: boolean;
    description: string;
    scheduledFor: Date;
    locale: string;
    status: Role;
    createdAt: Date;
    updatedAt: Date;
}

export type PostList = {
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
