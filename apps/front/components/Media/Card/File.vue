<template>
    <UCard :ui="customStyle">
        <div class="h-48  overflow-hidden">
            <img :src="getUrlImg" :alt="getNameParsed" class="w-full h-full object-cover" />
        </div>

        <template #footer>

            <span> {{ getNameParsed }}</span> <span class="bg-gray-600 p-1"> {{ mediaType }}</span>


        </template>
    </UCard>
</template>

<script setup lang="ts">
const { file } = defineProps<{
    file: {
        id: number,
        filePath: string,
        fileName: string,
        mimeType: string,
        folder: string,
        size: number,
        createdAt: string,
        updatedAt: string
    }
}>()

const customStyle = ref({
    base: ' overflow-hidden col-span-2 sm:col-span-1',
    body: {
        base: "h-48  overflow-hidden",
        padding: "p-0 sm:p-0",
    },

    footer: {
        base: "flex",
        background: "bg-slate-800/50",
    }
})

const mediaType = computed(() => {
    const mimeType = file.mimeType

    //image format
    if (mimeType.includes('image')) {
        return 'image'
    } else if (mimeType.includes('video')) {
        return 'video'
    } else if (mimeType.includes('audio')) {
        return 'audio'
    } else {
        return 'file'
    }
})


const getNameParsed = computed(() => {
    const nameWithoutCUID = file.fileName.split('_')[1]

    //remove the extension
    return nameWithoutCUID.split('.')[0]

})

const getUrlImg = computed(() => {
    const config = useRuntimeConfig();
    return config.public.api + '/' + file.filePath
})
</script>