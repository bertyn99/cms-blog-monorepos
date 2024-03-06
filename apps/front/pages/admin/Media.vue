<script setup>
definePageMeta({
    name: "Media Librairy",
});


const { $api } = useNuxtApp();
const mediaRepo = mediaRepository($api);
const headers = useRequestHeaders(['cookie'])
const { data: folders } = await useAsyncData('list-folder', () => mediaRepo.getAllFolder(headers)
)




const FileInPagesFolder = computed(() => folders.value ? folders.value.filter(f => f.folder !== "default") : [])


const { data: files } = await useAsyncData('list-files', () => mediaRepo.getAllFile(headers)
)

const fileInDefaultFolder = computed(() => files.value ? files.value : [])
</script>

<template>
    <UContainer class="space-y-8">
        <div class="mt-8">
            <h2 class="text-3xl font-bold">Folder</h2>
            <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                <MediaCardFolder v-for="f in FileInPagesFolder" :name="f.folder" />
            </div>
        </div>
        <UDivider />
        <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <MediaCardFile v-for="f in fileInDefaultFolder" :file="f" />
        </div>
    </UContainer>


</template>