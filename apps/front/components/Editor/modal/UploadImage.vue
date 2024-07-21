<template>
    <UModal v-model="isOpen" :ui="{
        width: ' sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl',
    }">
        <UCard :ui="{
            base: 'h-full min-w-64 flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
                base: 'grow',
            },
        }">

            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Upload a Image
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <UTabs :items="items">
                <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                        <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                        <span v-if="selected"
                            class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                </template>

                <template #item="{ item }">
                    <UCard>
                        <template #header>
                            <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                {{ item.label }}
                            </p>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {{ item.description }}

                            </p>
                        </template>
                        <div v-if="item.label === 'Use from library'">
                            <div
                                class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                                <MediaCardFolder v-for=" f in folderArrWithSelector " :name="f.name" :path="f.path"
                                    :numberOfFiles="f.mediaCount" v-model:selected="f.isSelected" :key="f.id" />
                            </div>
                            <UDivider />
                            <div class="mt-8">
                                <h2 class="text-3xl font-bold mb-3">Assets</h2>
                                <div
                                    class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                                    <MediaCardFile v-for=" f in fileArrWithSelector " :file="f" :key="f.id"
                                        @selected:file="updateSelectedFile" />
                                </div>
                            </div>
                        </div>
                        <div v-if="item.label === 'Upload with file'">
                            <InputMedia v-model="files" class="w-full" v-if="!files" />
                        </div>
                        <div v-if="item.label === 'Upload from url'">
                            <UFormGroup label="Url" name="url">

                                <UTextarea v-model="urls" />
                            </UFormGroup>

                        </div>

                        <template #footer>
                            <div class="flex items-center justify-between">
                                <UButton color="gray" variant="ghost" @click="isOpen = false">
                                    Cancel
                                </UButton>
                                <UButton color="primary" @click="addSelectedImage(selectedFile)">
                                    Selected #{{ selectedFile.length }}
                                </UButton>
                            </div>
                        </template>
                    </UCard>


                </template>
            </UTabs>
            <!--  <div class="h-full flex">

                <InputMedia v-model="files" class="w-full" v-if="!files" />

            </div> -->


        </UCard>

    </UModal>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
const { editor } = defineProps({
    editor: Object as PropType<any>,
})

const items = [{
    icon: 'i-heroicons-folder-20-solid',
    label: 'Use from library',
    content: 'Choose from the library of images'
}, {
    icon: 'i-heroicons-document-arrow-down-20-solid',
    label: 'Upload with file',
    content: 'Upload a file from your computer'
}, {
    icon: 'i-heroicons-document-duplicate-20-solid',
    label: 'Upload from url',
    content: 'Copy and paste the url of the image you want to upload'
},]
const files = ref(null)

const isOpen = defineModel();

const urls = ref('')


//load the media library
const folderName = ref('/')

const { fetchMedia } = useMediaLibrary()
const { data: Media, refresh: refreshMedia, pending } = await useLazyAsyncData(`list-media-${folderName.value}`, () => fetchMedia(folderName), { watch: [folderName] })

const folders = computed(() => pending.value ? [] : Media.value[0])
const filesLib = computed(() => pending.value ? [] : Media.value[1])

watch(folders, (folders) => {
    console.log('folders', folders);
    console.log('files', files.value);
})
const listOfFolder = computed(() => folders.value.data ?? [])

const fileInFolder = computed(() => filesLib.value.data ?? [])


const { dataArrWithSelector: folderArrWithSelector, selectedElement: selectedFolder } = useSelector(listOfFolder)
watch(folderArrWithSelector, (folderArrWithSelector) => {
    console.log('folderArrWithSelector', folderArrWithSelector);
}, { deep: true })
const { dataArrWithSelector: fileArrWithSelector, selectedElement: selectedFile } = useSelector(fileInFolder)

watch(fileArrWithSelector, (fileArrWithSelector) => {
    console.log('fileArrWithSelectosr', fileArrWithSelector);
}, { deep: true })

watch(selectedFolder, (selectedFolder) => {
    console.log('selectedFolder', selectedFolder);

})

const updateSelectedFile = (value: any) => {
    console.log('updateSelectedFile', value);
    //find the file and update the selected value
    const index = fileArrWithSelector.value.findIndex(f => f.id === value.id)
    fileArrWithSelector.value[index].isSelected = value.isSelected
}

const addSelectedImage = (listFiles: any) => {
    console.log('addSelectedImage', listFiles);
    const config = useRuntimeConfig();
    listFiles.forEach((file: any) => {
        editor?.chain().focus().setImage({ src: config.public.api + '/' + file.filePath }).run()

    })

    isOpen.value = false

}



</script>