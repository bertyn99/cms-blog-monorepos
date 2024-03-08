<template>
    <UCard :ui="customStyle">
        <template #header>
            <div class="flex justify-between">
                <UCheckbox name="selection" v-model="file.isSelected" />

                <UButton @click="isOpen = true" icon="i-heroicons-pencil-square" variant="soft"
                    class="hidden group-hover:block" />
            </div>
        </template>
        <div class="h-48  overflow-hidden">
            <img :src="getUrlImg" :alt="getNameParsed" class="w-full h-full object-cover" />
        </div>

        <template #footer>

            <div class="flex flex-col"><span> {{ getNameParsed }}</span>
                <span class="text-gray-700 text-xs"> {{ convertSize(file.size) }}</span>
            </div> <span class="bg-gray-600 px-2  inline-flex items-center rounded-lg h-6"> {{ mediaType }}</span>


        </template>
    </UCard>

    <MediaModalFile v-model="isOpen" :file="file" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'


export type File = {
    id: number,
    filePath: string,
    fileName: string,
    mimeType: string,
    folder: string,
    size: number,
    isSelected: boolean,
    createdAt: string,
    updatedAt: string
}
const { file } = defineProps({
    file: {
        type: Object as PropType<File>,
        required: true
    }

})

const emit = defineEmits(['selected:file']);
watch(file, (newFile) => {
    emit('selected:file', newFile);
});


const isOpen = ref(false)
const customStyle = ref({
    base: 'relative overflow-hidden col-span-2 sm:col-span-1 group',
    body: {
        base: "h-48  overflow-hidden z-1",
        padding: "p-0 sm:p-0",
    },
    header: {
        base: 'absolute inset-x-0 top-0 z-90',
        background: "bg-transparent",
        padding: "p-1 sm:p-2"
    },

    footer: {
        base: "flex justify-between items-center",
        background: "bg-slate-800/50",
        padding: 'py-2'
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
    const nameWithoutCUID = file?.fileName?.split('_')[1] ?? 'fileName'

    //remove the extension
    return nameWithoutCUID.split('.')[0]

})

const getUrlImg = computed(() => {
    const config = useRuntimeConfig();
    return config.public.api + '/' + file.filePath
})

const convertSize = (size) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (size === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)).toString());
    return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
</script>