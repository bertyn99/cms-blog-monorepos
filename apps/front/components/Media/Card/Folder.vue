<template>
    <UCard :ui="customStyle">
        <template #header>
            <div class="flex justify-between">
                <UCheckbox name="selection" v-model="selected" />

                <UButton :to="{
                    name: 'Media Librairy',
                    query: {
                        folder: path,
                    }
                }" icon="i-heroicons-eye" variant="soft" class="hidden group-hover:block" />
            </div>
        </template>

        <div class="bg-primary-200 w-20 rounded-md  py-2 inline-flex justify-center">
            <UIcon name="i-twemoji-file-folder" class="w-12 h-12 mx-auto text-primary-500" />
        </div>
        <div>
            <span class="flex items-center justify-center text-gray-800 font-semibold"> {{ name }} </span>
            <span class="flex items-center justify-center text-gray-800 text-xs ">{{ numberOfFolders ?? 0 }} folder - {{
                numberOfFiles
            }} files</span>
        </div>

    </UCard>

    <!--     <MediaModalFolder v-model="isOpen" /> -->
</template>

<script setup>
defineProps({
    name: String,
    numberOfFiles: Number,
    numberOfFolders: Number,
    path: String

})

const selected = defineModel('selected')


const customStyle = ref({
    base: 'relative overflow-hidden col-span-2 sm:col-span-1 group px-5',
    body: {
        base: "h-32  overflow-hidden flex items-center gap-2 ",
        padding: "p-0 sm:p-0",
    },
    header: {
        base: 'absolute inset-x-0 top-0 z-90',
        background: "bg-transparent",
        padding: "p-1 sm:p-2"
    },

})
</script>