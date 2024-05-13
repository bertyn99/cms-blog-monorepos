<template>

</template>
<script setup lang="ts">
definePageMeta({
    name: 'Members',
    middleware: ['auth-guard']
});

import type { Member } from '~/types'

const { data: members } = await useFetch<Member[]>('/api/members', { default: () => [] })

const q = ref('')
const isInviteModalOpen = ref(false)

const filteredMembers = computed(() => {
    return members.value.filter((member) => {
        return member.name.search(new RegExp(q.value, 'i')) !== -1 || member.username.search(new RegExp(q.value, 'i')) !== -1
    })
})
</script>