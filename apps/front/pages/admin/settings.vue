<script setup lang="ts">

definePageMeta({
    name: 'Settings'
})

const links = [[{
    label: 'General',
    icon: 'i-heroicons-user-circle',
    to: '/admin/settings',
    exact: true
}, {
    label: 'Members',
    icon: 'i-heroicons-user-group',
    to: '/admin/settings/members'
}], [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    to: 'https://ui.nuxt.com/pro',
    target: '_blank'
}]]

const route = useRoute()

//check if we are on the members page
const isMembersPage = computed(() => route.path.includes('members'))
</script>

<template>

    <DashboardNavbar>
        <template #right v-if="isMembersPage">
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="New User" trailing variant="soft" />



        </template>

    </DashboardNavbar>

    <div class="py-0 px-1.5 overflow-x-auto border-b">
        <UHorizontalNavigation :links="links" />
    </div>

    <NuxtPage />
</template>