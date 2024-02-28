<template>
    <DashboardNavbar>

        <template #right>
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="New Pages" trailing variant="soft" />



        </template>

    </DashboardNavbar>
</template>

<script lang="ts" setup>
definePageMeta({
    name: 'Pages'
})

</script>
