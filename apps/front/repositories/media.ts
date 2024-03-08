import type { $Fetch, NitroFetchRequest, NitroFetchOptions } from "nitropack";

export const mediaRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getAllFile(folder:string='',options?: any) {
    const mergeOptions = {
      credentials: "include",
      params:{
        folder:folder==''?'default':folder
      },
      ...options,
    };
    return fetch("/media?folder=default", mergeOptions);
  },

  async getAllFolder(folder:string='',options?: any) {
    const mergeOptions = {
      credentials: "include",
      params:{
        folder:folder
      },
      ...options,
    };
    return fetch("/media/folder", mergeOptions);
  },
});
