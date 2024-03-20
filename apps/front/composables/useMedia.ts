
export const useMediaLibrary = () => {
    const { $api } = useNuxtApp();
    const mediaRepo = mediaRepository($api);
    const headers = useRequestHeaders(['cookie']);
    const loading = ref(false);
    const toast = useToast();
    const orderBy = ref('date:asc');
    const searchQuery = ref('');

    const fetchFolders = async (folderName?: Ref<string>) => {
        if (folderName?.value) return 1;
        const { data: folders, refresh: refreshFolder } = await useAsyncData(`list-folder-${folderName.value !== '' ? folderName.value : 'default'}`, () => mediaRepo.getAllFolder(folderName.value, headers)
            ,)






        const { data: files, refresh: refreshFile } = await useAsyncData(`list-files-${folderName.value !== '' ? folderName.value : 'default'}`, () => mediaRepo.getAllFile(folderName.value, headers)
            ,
        )

        console.log(folders, files)
        return {
            folders,
            files,
            refreshFolder,
            refreshFile
        }
    };

    const uploadMedia = async (formData: FormData, folderName: string) => {
        try {
            loading.value = true;
            const res = await mediaRepo.uploadFile(formData, headers);

            if (res) {
                loading.value = false;
                fetchFolders();
            }
            return res;
        } catch (error: any) {
            loading.value = false;
            toast.add({
                id: `upload-media-error`,
                color: 'red',
                icon: 'i-heroicons-x-circle',
                title: 'Error uploading media',
                description: error.message,
            });
        }
    }

    return {
        orderBy,
        searchQuery,
        fetchFolders,

    };

}