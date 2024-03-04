<template>
    <UCard :ui="customStyle">
        <div class="h-32 w-36 bg-green-400 ">

        </div>

        <template #footer>
            <div class="h-8">

            </div>
        </template>
    </UCard>
</template>

<script setup>
import { _padding } from '#tailwind-config/theme';


defineProps({
    name: String,
    image: String,
    link: String,
})

const customStyle = {
    body: {
        padding: "p-0",
        background: "bg-red-300",
    },
    header: {
        base: "h-32 w-36 bg-red-800",

    },
    footer: {
        base: "h-8"
    }
}
</script>