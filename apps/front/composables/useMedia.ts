
export const useMediaLibrary = () => {
    const { $api } = useNuxtApp();
    const mediaRepo = mediaRepository($api);
    const headers = useRequestHeaders(['cookie']);
    const loading = ref(false);
    const toast = useToast();
    const orderBy = ref('date:asc');
    const searchQuery = ref('');

    const fetchMedia = async (name: MaybeRef<string>) => {
        const folderName = toValue(name) ?? 'default';
        console.log('folder api call', folderName);
        return Promise.all([mediaRepo.getAllFolder(folderName == 'default' ? '' : folderName, headers), mediaRepo.getAllFile(folderName, headers)])

    };

    const uploadMedia = async (formData: FormData, folderName: string) => {
        try {
            loading.value = true;
            const res = await mediaRepo.uploadFile(formData, headers);

            if (res) {
                loading.value = false;
                fetchMedia('default');
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
        fetchMedia,

    };

}