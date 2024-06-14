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
            <template #header>
                <div class="flex items

                -center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Delete {{ member?.fullName }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>
            <p>
                Are you sure you want to delete the menber {{ member?.fullName }}? He is a {{ member?.roleAccess }}.
                Their is no way
                to undo this action.

            </p>
            <template #footer>
                <div class="flex items-center justify-between">
                    <UButton @click="isOpen = false" color="gray" variant="ghost">Cancel</UButton>
                    <UButton @click="handleDeleteMenber" color="red">Delete</UButton>

                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">


const { member } = defineProps(['member'])
console.log(member)
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const { deleteUser } = useMember()

const handleDeleteMenber = async () => {
    await deleteUser(member.id)
    isOpen.value = false
}
</script>