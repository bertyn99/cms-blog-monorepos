<script setup>
definePageMeta({
    name: "Media Librairy",
});
const route = useRoute()

const folderName = computed(() => route.query.folder ?? null)

const { fetchMedia } = useMediaLibrary()
const { data: Media, refresh: refreshMedia, pending } = await useLazyAsyncData(`list-media-${folderName.value ? 'default' : folderName.value}`, () => fetchMedia(folderName), { watch: [folderName] })



watch(folderName, async (folderName, previous) => {
    console.log('folderName', folderName);

})

watch(Media, (media) => {
    console.log('media', media);
})
const folders = computed(() => pending.value ? [] : Media.value[0])
const files = computed(() => pending.value ? [] : Media.value[1])

watch(folders, (folders) => {
    console.log('folders', folders);
    console.log('files', files.value);
})

const listOfFolder = computed(() => folders.value ?? [])

const fileInFolder = computed(() => files.value ?? [])


const { dataArrWithSelector: folderArrWithSelector, selectedElement: selectedFolder } = useSelector(listOfFolder)
watch(folderArrWithSelector, (folderArrWithSelector) => {
    console.log('folderArrWithSelector', folderArrWithSelector);
})
const { dataArrWithSelector: fileArrWithSelector, selectedElement: selectedFile } = useSelector(fileInFolder)



const refresfData = () => {
    refreshMedia()
}
const orderBy = ref('date:asc')
const searchQuery = ref('')
const isOpen = ref(false)

const uploadAssets = () => {
    isOpen.value = true
}

const updateSelectedFile = (value) => {
    console.log('updateSelectedFile', value)

    //find the file and update the selected value
    const index = fileArrWithSelector.value.findIndex(f => f.id === value.id)
    fileArrWithSelector.value[index].isSelected = value.isSelected

}
</script>

<template>

    <DashboardNavbar>


        <template #right>

            <UInput v-model="searchQuery" placeholder="Search" icon="i-heroicons-magnifying-glass-20-solid" />
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="Upload Assets" trailing variant="soft"
                @click="uploadAssets" />



        </template>

    </DashboardNavbar>

    <UContainer class="space-y-8">
        <MediaModalNew v-model="isOpen" v-if="isOpen" :folderName="folderName" />
        <template v-if="pending">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
                <USkeleton class="h-4 w-[250px]" />
                <USkeleton class="h-4 w-[200px]" />
            </div>
        </template>
        <template v-else>
            <MediaFilter v-model:orderBy="orderBy" :selectedFolder="selectedFolder" :selectedFile="selectedFile"
                :refresh="refresfData" />


            <div class="mt-8">

                <h2 class="text-3xl font-bold mb-3">Folder</h2>
                <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    <MediaCardFolder v-for="f in folderArrWithSelector" :name="f.folder" :parent="folderName"
                        v-model:selected="f.isSelected" />
                </div>
            </div>
            <UDivider />
            <div class="mt-8">
                <h2 class="text-3xl font-bold mb-3">Assets</h2>
                <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    <MediaCardFile v-for="f in fileArrWithSelector" :file="f" :key="f.id"
                        @selected:file="updateSelectedFile" />
                </div>
            </div>
        </template>
    </UContainer>


</template>