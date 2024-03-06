import type { $Fetch, NitroFetchRequest, NitroFetchOptions } from "nitropack";

export const mediaRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getAllFile(options?: any) {
    const mergeOptions = {
      credentials: "include",
      ...options,
    };
    return fetch("/media?folder=default", mergeOptions);
  },

  async getAllFolder(options?: any) {
    const mergeOptions = {
      credentials: "include",
      ...options,
    };
    return fetch("/media/folder", mergeOptions);
  },
});
