<template>
    <DashboardNavbar>

        <template #right>
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="New User" trailing variant="soft" />



        </template>

    </DashboardNavbar>
</template>
<script setup lang="ts">
definePageMeta({
    name: 'Users',
});
</script>