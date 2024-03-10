<script setup>
definePageMeta({
    name: "Media Librairy",
});
const route = useRoute()

const folderName = computed(() => route.query.folder ? route.query.folder : '')
const { $api } = useNuxtApp();
const mediaRepo = mediaRepository($api);
const headers = useRequestHeaders(['cookie'])


watch(folderName, (folderName, previous) => {

})
const { data: folders, refresh: refreshFolder } = await useAsyncData(`list-folder-${folderName.value !== '' ? folderName.value : 'default'}`, () => mediaRepo.getAllFolder(folderName.value, headers)
    , { watch: [folderName] })






const { data: files, refresh: refreshFile } = await useAsyncData(`list-files-${folderName.value !== '' ? folderName.value : 'default'}`, () => mediaRepo.getAllFile(folderName.value, headers)
    , { watch: [folderName] }
)

const listOfFolder = computed(() => folders.value ? folders.value.filter(f => f.folder !== "default") : [])

const fileInDefaultFolder = computed(() => files.value ? files.value : [])


const { dataArrWithSelector: folderArrWithSelector, selectedElement: selectedFolder } = useSelector(listOfFolder.value)

const { dataArrWithSelector: fileArrWithSelector, selectedElement: selectedFile } = useSelector(fileInDefaultFolder.value)



const refresfData = () => {
    refreshFolder()
    refreshFile()
}
const orderBy = ref('date:asc')
const searchQuery = ref('')

const uploadAssets = () => {
    console.log('upload assets')
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
        <MediaFilter v-model:orderBy="orderBy" :selectedFolder="selectedFolder" :selectedFile="selectedFile"
            :refresh="refresfData" />


        <div class="mt-8">

            <h2 class="text-3xl font-bold mb-3">Folder</h2>
            <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                <MediaCardFolder v-for="f in folderArrWithSelector" :name="f.folder" :parent="folderName.value"
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
    </UContainer>


</template>