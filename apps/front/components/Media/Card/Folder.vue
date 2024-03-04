<template>
    <UCard :ui="customStyle">

        <UIcon name="i-twemoji-file-folder" class="w-56 h-56 mb-6" />
        <template #footer>

            {{ name }}
        </template>
    </UCard>

</template>

<script setup>
defineProps({
    name: String,
    image: String,
    link: String,
})


const customStyle = ref({
    base: 'relative overflow-hidden max-w-56',
    body: {
        base: "h-48  overflow-hidden",
        padding: "p-0 sm:p-0",
    },
    header: {
        base: " bg-red-800",
        background: "bg-transparent",
        padding: "p-0 sm:p-0"

    },
    footer: {
        base: "absolute inset-x-0 bottom-0 h-6 flex items-center justify-center text-white bg-slate-800/50",
        background: "bg-slate-800/50",
    }
})
</script>