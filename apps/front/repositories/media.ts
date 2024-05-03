import type { $Fetch, NitroFetchRequest, NitroFetchOptions } from "nitropack";
import type { File, IDeleteMediaAndFolder } from "~/types/media";

export const mediaRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getAllFile(folder: string = "", options?: any) {
    const mergeOptions = {
      credentials: "include",
      params: {
        folder: folder == "" ? "/" : folder,
      },
      ...options,
    };
    return fetch("/media?folder=default", mergeOptions);
  },

  async getAllFolder(folder: string = "", options?: any) {
    const mergeOptions = {
      credentials: "include",
      params: {
        folder: folder,
      },
      ...options,
    };
    return fetch("/media/folder", mergeOptions);
  },

  async uploadFile(data: FormData, options?: any) {
    const mergeOptions = {
      credentials: "include",
      method: "POST",
      ...options,
      body: data,
    };
    return fetch("/media", mergeOptions);
  },

  async deleteFileAndFolder(data: IDeleteMediaAndFolder, options?: any) {
    console.log(options);
    const mergeOptions = {
      method: "DELETE",
      credentials: "include",
      ...options,
      body: JSON.stringify(data),
    };
    return fetch("/media", mergeOptions);
  },

  async updateFile(id: number, data: Partial<File>, options?: any) {
    const mergeOptions = {
      method: "PUT",
      credentials: "include",
      ...options,
      body: JSON.stringify(data),
    };
    return fetch(`/media/${id}`, mergeOptions);
  },
});
