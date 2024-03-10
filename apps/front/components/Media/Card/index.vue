<template>
    <UCard :ui="customStyle">

        <slot name="content" />
        <template #footer>
            <div class="h-8">
                {{ name }}
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

        padding: "p-0 sm:p-0",
    },
    header: {
        base: "h-32 w-36 bg-red-800",
        background: "bg-transparent",
        padding: "p-0 sm:p-0"

    },
    footer: {
        base: "h-12"
    }
}
</script>