import type { Role } from "@yggdra/shared";
import type { $Fetch, NitroFetchRequest, NitroFetchOptions } from "nitropack";
import type { Post, PostList } from "@yggdra/shared";

export const postRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getAllPostBylocal(options?: any) {
    const mergeOptions = {
      credentials: "include",
      ...options,
    };
    return fetch<PostList>("/posts/", mergeOptions);
  },

  async getPost(id: number, headers?: any) {
    return fetch<{ id: Number, translations: Post[] }>(`/posts/${id}`, {
      method: "GET",
      headers,
    });
  },

  async getPostContentByLocale(id: number, locale: string, headers?: any) {
    const mergeOptions: any = {
      method: "GET",
      headers,
      credentials: "include",
    };

    /*       console.log(mergeOptions); */
    return fetch<Post>(`/posts/${id}/${locale}`, mergeOptions);
  },
  async createPost(post: Post, headers: any) {
    return fetch<Post>("/posts/", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(post),
    });
  },
  async updatePost(id: number, post: Post) {
    return fetch<Post>(`/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(post),
    });
  },
  async publishPost(arrIds: number[], headers?: any) {
    return fetch<{ message: string }>(`/posts/publish`, {
      method: "POST",
      credentials: "include",
      ...headers,
      body: JSON.stringify({ postIds: arrIds }),
    });
  },
  async unpublishPost(arrIds: number[], headers?: any) {
    return fetch<{ message: string }>(`/posts/unpublish`, {
      method: "POST",
      credentials: "include",
      ...headers,
      body: JSON.stringify({ postIds: arrIds }),
    });

  },

  async deletePost(id: number, locale: string, headers?: any) {
    return fetch<{ message: string }>(`/posts/${id}/locale/${locale}`, {
      method: "DELETE",
      credentials: "include",
      ...headers,
    });
  },
  async deleteListOfPost(arrIds: number[], locale: string, headers?: any) {
    return fetch<{ message: string }>(`/posts/locale/${locale}`, {
      method: "DELETE",
      credentials: "include",
      ...headers,
      body: JSON.stringify({ postIds: arrIds }),
    });
  },


});
