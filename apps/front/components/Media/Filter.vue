<template>
    <div class="px-1 py-4 space-y-2">
        <div class="flex justify-between w-full">
            <div class="flex items-center gap-2">
                <div
                    class="p-1.5 shadow-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md sho">
                    <UCheckbox v-model="selected" name="notifications" />
                </div>

                <USelectMenu :options="orderByOptions" value-attribute="value" v-model="orderBy"
                    :ui="{ background: 'bg-blue-50 dark:bg-blue-950' }" class="w-32" />


            </div>
        </div>
        <div class="w-full flex gap-36" v-if="displaySelectText">
            <span>{{ selectedFolder.length }} folder - {{ selectedFile.length }} assets</span>

            <div>
                <UButton size="sm" icon="i-heroicons-trash-solid" color="red" label="Delete" variant="soft"
                    @click="deleteMedia" :loading="loading" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { IDeleteMediaAndFolder } from '~/types/media';

const selected = defineModel('selected', { type: Boolean, default: false })
const orderBy = defineModel('orderBy', { type: String, default: 'date:asc' })

const { selectedFolder, selectedFile, refresh } = defineProps({
    selectedFolder: {
        type: Array,
        default: []
    },
    selectedFile: {
        type: Array,
        default: []
    },
    refresh: {
        type: Function,
        default: () => { }
    }
})
const orderByOptions = [
    { label: 'A to Z', value: 'name:asc' },
    { label: 'Z to A', value: 'name:desc' },
    { label: 'Oldest Upload', value: 'date:desc' },
    { label: 'Most Recent Upload', value: 'date:asc' },
    { label: 'Size', value: 'size' },
    { label: 'Type', value: 'type' },
]


const { $api } = useNuxtApp();
const mediaRepo = mediaRepository($api);
const headers = useRequestHeaders(['cookie'])
const loading = ref(false)
const displaySelectText = computed(() => selectedFolder.length > 0 || selectedFile.length > 0)


const deleteMedia = async () => {
    if (selectedFolder.length > 0 || selectedFile.length > 0) {
        const data: IDeleteMediaAndFolder = {
            fileIds: selectedFile.map((f: any) => f.id) as number[],
            folders: selectedFolder.map((f: any) => f.id) as number[]
        }

        try {
            loading.value = true
            const res = await mediaRepo.deleteFileAndFolder(data, headers)

            if (res.msg) {
                loading.value = false
                //TODO fix bug invalidation cache
                /*      clearNuxtData('list-folder-') */
                refresh()

            }
        } catch (error) {
            loading.value = false
            console.log('error', error)
            //throw notification error
        }

    }


}


</script>