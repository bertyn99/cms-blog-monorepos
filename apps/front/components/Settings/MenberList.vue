<script setup lang="ts">
import type { User } from '~/types/auth-form';

const members = defineModel('members', { type: Array as PropType<User[]>, default: [] })
const { changeUsersRole, deleteUser } = useMember()
const seletedMember = ref<User | null>(null)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const userIds = ref<string[]>([])
function getItems(member: User) {
    return [[{
        label: 'Edit member',
        click: () => {
            seletedMember.value = member
            showEditModal.value = true
        }
    }, {
        label: 'Remove member',
        labelClass: 'text-red-500 dark:text-red-400',
        click: () => {
            seletedMember.value = member
            showDeleteModal.value = true
        }

    }]]
}



async function onRoleChange(member: User, role: string) {
    // change role
    console.log('Role change', member, role)

    userIds.value.push(member.id)
    // update role

    await changeUsersRole(userIds.value, role)

    //loop through the array and change the roleAccess
    userIds.value.forEach((id) => {
        const index = members.value.findIndex((member) => member.id === id)
        members.value[index].roleAccess = role
    })
}


</script>

<template>
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
        <li v-for="(member, index) in members" :key="index"
            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
            <div class="flex items-center gap-3 min-w-0">
                <UAvatar v-bind="member?.avatar" :alt="member?.fullName" size="md" />

                <div class="text-sm min-w-0">
                    <p class="text-gray-900 dark:text-white font-medium truncate">
                        {{ member.email }}
                    </p>
                    <p class="text-gray-500 dark:text-gray-400 truncate">
                        {{ member.fullName }}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <USelectMenu :model-value="member.roleAccess" :options="['user', 'admin', 'editor']" color="white"
                    :ui-menu="{ select: 'capitalize w-24', option: { base: 'capitalize' } }"
                    @update:model-value="onRoleChange(member, $event)" />

                <UDropdown :items="getItems(member)" position="bottom-end">
                    <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
                </UDropdown>
            </div>
        </li>
    </ul>
    <SettingsModalDeleteMenber v-model:isOpen="showDeleteModal" :member="seletedMember" v-if="showDeleteModal" />
    <SettingsModalEditMenber v-model:isOpen="showEditModal" :member="seletedMember" v-if="showEditModal" />
</template>