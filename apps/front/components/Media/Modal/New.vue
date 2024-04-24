<template>
    <UModal v-model="isOpen">
        <UCard :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
            base: 'grow'
        }
    }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Add new media
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <div class="h-full flex">

                <InputMedia v-model="files" class="w-full" v-if="!files" />
                <template v-else>
                    <!--        {{ filesFormatted.length }} -->
                    <MediaCardFile v-for="f in filesFormatted" :file="f" :key="f.id" />
                </template>
            </div>

            <template #footer>
                <div class="flex items-center justify-between">
                    <UButton color="gray" variant="ghost" @click="isOpen = false">
                        Cancel
                    </UButton>
                    <UButton color="primary" @click="handleUploadAssets">
                        Upload
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>

</template>

<script setup>
const { folderName } = defineProps(['folderName'])
const isOpen = defineModel()
const files = ref(null)

const { uploadMedia } = useMediaLibrary()

console.log('New Media', isOpen.value)
const filesFormatted = computed(() => {
    return files.value ? files.value.map((f, i) => {
        return {
            id: i,
            filePath: f.name,
            fileName: f.name,
            mimeType: f.name.substr(f.name.lastIndexOf(".") + 1),
            folder: folderName,
            size: f.size,
            isSelected: false,
        }
    }) : []
})
const handleUploadAssets = async () => {
    console.log('uploadAssets', files)
    console.log('uploadAssets', filesFormatted.value)
    const formData = new FormData()
    formData.append('folder', folderName);
    files.value.forEach((f) => {
        formData.append('medias', f)
    })

    try {
        const res = await uploadMedia(formData)
        console.log(res)

        if (res.msg) {
            await refreshNuxtData(`list-media-${folderName}`)
            isOpen.value = false
        }
    } catch (error) {
        console.log(error)
    }

}

watch(files, (files) => {
    console.log('files', files)
})
</script>