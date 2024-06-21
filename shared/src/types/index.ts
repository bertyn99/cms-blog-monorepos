export enum Role {
  USER = 1,
  AUTHOR = 2,
  EDITOR = 3,
  ADMIN = 4,
}

export enum PostStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
}

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  structuredData: any;
};

export type Post = {
  id?: number;
  title: string;
  postId?: number | null;
  content: string;
  slug: string;
  published: boolean;
  description: string;
  scheduledFor?: Date;
  locale: string;
  seo?: Seo | null;
  status?: PostStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewPost = Omit<Post, "id" | "postId" | "createdAt" | "updatedAt">;

export type PostList = {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: null | string;
    previousPageUrl: null | string;
  };
  data: Post[];
};
