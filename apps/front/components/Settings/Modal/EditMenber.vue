<template>
    <UModal v-model="isOpen">
        <UCard :ui="{
            base: 'h-full min-w-64 flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
                base: 'grow',
            },
        }">

        </UCard>
    </UModal>
</template>

<script setup lang="ts">

const isOpen = defineModel('isOpen', { type: Boolean, default: false })

</script>