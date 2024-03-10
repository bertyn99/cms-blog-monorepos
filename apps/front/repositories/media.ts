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

  async uploadFile(data: FormData, options?: any) {
    const mergeOptions = {
      credentials: "include",
      method:"POST",
      ...options,
    };
    return fetch("/media", mergeOptions);
  },

  async deleteFileAndFolder(data: FormData, options?: any) {
    console.log(options);
    const mergeOptions = {
      method:"DELETE", 
      credentials: "include",
      ...options,
      body: JSON.stringify(data),
      
    };
    return fetch("/media", mergeOptions);
  },
});
