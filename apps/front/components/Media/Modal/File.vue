<template>
    <UModal v-model="isOpen">
        <UCard :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
            base: 'grow'
        }
    }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Details File
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <div class="h-full flex">
                <div><img></div>
                <div></div>
            </div>

            <template #footer>
                <div class="flex items-center justify-between">
                    <UButton color="gray" variant="ghost" @click="isOpen = false">
                        Cancel
                    </UButton>
                    <UButton color="primary" @click="isOpen = false">
                        Save
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>

const isOpen = defineModel()
</script>