<template>
    <UCard :ui="customStyle">
        <template #header>
            <div class="flex justify-between">
                <UCheckbox name="selection" v-model="selected" />

                <UButton :to="{
        name: 'Media Librairy',
        query: {
            folder: parent + '/' + name,
        }
    }" icon="i-heroicons-eye" variant="soft" class="hidden group-hover:block" />
            </div>
        </template>
        <UIcon name="i-twemoji-file-folder" class="w-56 h-56 mb-6" />

        <template #footer>

            {{ name }}- {{ numberOfFiles }}files
        </template>
    </UCard>

    <!--     <MediaModalFolder v-model="isOpen" /> -->
</template>

<script setup>
defineProps({
    name: String,
    numberOfFiles: Number,
    parent: String

})

const selected = defineModel('selected')


const isOpen = ref(false)
const customStyle = ref({
    base: 'relative overflow-hidden col-span-2 sm:col-span-1 group',
    body: {
        base: "h-48  overflow-hidden",
        padding: "p-0 sm:p-0",
    },
    header: {
        base: 'absolute inset-x-0 top-0 z-90',
        background: "bg-transparent",
        padding: "p-1 sm:p-2"
    },
    footer: {
        base: "absolute inset-x-0 bottom-0 h-6 flex items-center justify-center text-white bg-slate-800/50",
        background: "bg-slate-800/50",
    }
})
</script>