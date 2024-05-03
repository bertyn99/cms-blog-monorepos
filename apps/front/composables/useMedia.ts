import type { File } from "~/types/media";

export const useMediaLibrary = () => {
  const { $api } = useNuxtApp();
  const mediaRepo = mediaRepository($api);
  const cookieHeader = useRequestHeaders(["cookie"]);
  const loading = ref(false);
  const toast = useToast();
  const orderBy = ref("date:asc");
  const searchQuery = ref("");

  const fetchMedia = async (name: MaybeRef<string>) => {
    const folderName = toValue(name) ?? "/";
    console.log("folder api call", folderName);
    const headers = { ...cookieHeader };
    return Promise.all([
      mediaRepo.getAllFolder(folderName == "/" ? "" : folderName, headers),
      mediaRepo.getAllFile(folderName, headers),
    ]);
  };

  const uploadMedia = async (formData: FormData) => {
    try {
      loading.value = true;
      const headers = {
        "Content-Type": "multipart/form-data",
        ...cookieHeader,
      };
      const res = await mediaRepo.uploadFile(formData, headers);

      if (res) {
        loading.value = false;
      }
      return res;
    } catch (error: any) {
      loading.value = false;
      toast.add({
        id: `upload-media-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Error uploading media",
        description: error.message,
      });
    }
  };

  const updateMedia = async (id: number, file: Partial<File>) => {
    try {
      loading.value = true;
      const headers = {
        "Content-Type": "application/json",
        ...cookieHeader,
      };
      const res = await mediaRepo.updateFile(id, file, headers);

      if (res) {
        loading.value = false;
      }
      toast.add({
        id: `dupdate-media-success-${id}`,
        color: "green",
        icon: "i-heroicons-check-circle",
        title: "Media updated successfully",
      });
      return res;
    } catch (error: any) {
      loading.value = false;
      toast.add({
        id: `update-media-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Error updating media",
        description: error.message,
      });
    }
  };

  const deleteMedia = async (id: number) => {
    const data: { fileIds: number[]; folders: number[] } = {
      fileIds: [id],
      folders: [],
    };
    try {
      loading.value = true;
      const headers = {
        "Content-Type": "application/json",
        ...cookieHeader,
      };
      const res = await mediaRepo.deleteFileAndFolder(data, headers);

      if (res) {
        loading.value = false;
        toast.add({
          id: `delete-media-success`,
          color: "green",
          icon: "i-heroicons-check-circle",
          title: "Media deleted successfully",
        });
      }
      return res;
    } catch (error: any) {
      loading.value = false;
      toast.add({
        id: `delete-media-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Error deleting media",
        description: error.message,
      });
      throw error;
    }
  };

  return {
    orderBy,
    searchQuery,
    fetchMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    loading,
  };
};
