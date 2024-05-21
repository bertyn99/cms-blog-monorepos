<template>
    <div class="p-4 flex-1 flex flex-col overflow-y-auto pb-24">
        <div
            class="grid lg:grid-cols-3 pt-2 pb-6 items-start first:*:col-span-2 lg:first:*:col-span-1 last:*:col-span-2 gap-6">
            <div class="flex lg:flex-col justify-between flex-row flex-wrap gap-4 lg:sticky top-2">
                <div class="flex items-start gap-4">
                    <div>
                        <p class="text-gray-900 dark:text-white font-semibold">Manage access</p>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Invite new members by email address.
                        </p>
                    </div>


                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                    <UButton @click="isInviteModalOpen = true" color="primary">Invite member</UButton>
                </div>
            </div>
            <div
                class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 min-w-0">
                <div class="p-4 sm:px-6">
                    <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                        placeholder="Search..." />
                </div>
                <div>
                    <SettingsMenberList :members="filteredMembers" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    name: 'Members',
    middleware: ['auth-guard']
});

import type { User } from '~/types'

const { members, fetchMembers } = useMember()

fetchMembers()


const q = ref('')
const isInviteModalOpen = ref(false)

const filteredMembers = computed(() => {
    return members.value.filter((member) => {
        return member.fullName.search(new RegExp(q.value, 'i')) !== -1 || member.email.search(new RegExp(q.value, 'i')) !== -1
    })
})
</script>