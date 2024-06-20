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
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Edit Member information
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <UForm ref="form" :state="state" class="space-y-6" @submit="onSubmit" :validate="validate" @error="onError">
                <UFormGroup v-for="field in fields" :key="field.label" :label="field.label"
                    :name="field.label.toLowerCase()">
                    <UInput v-model="state[field.label.toLowerCase()]" :placeholder="field.placeholder"
                        :type="field.type" />
                </UFormGroup>

                <UButton type="submit" :disabled="loading" block>
                    Submit
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import vine from '@vinejs/vine';

const { member } = defineProps({
    member: {
        type: Object,
        required: true,
    },
});

const isOpen = defineModel('isOpen', { type: Boolean, default: false })

const fields = [
    {
        name: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",

    },
    {
        name: "email",
        type: "text",
        label: "Email",
        placeholder: "Enter your email",

    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
    },
    {
        name: "bio",
        type: "text",
        label: "Bio",
        placeholder: "Few sentence about you",

    },
];

const loading = ref(false);
//generate a reactive state object that adapts with the fields
const state = reactive<{ [key: string]: any }>(
    {
        fullName: member.fullName,
        email: member.email,
        password: member.password,
        bio: member.bio,
        avatar: member.avatar,
    }
);

const schema = vine.object({
    fullName: vine.string().minLength(4),
    email: vine.string().email(),
    password: vine
        .string()
        .minLength(4)
        .maxLength(32),
    bio: vine.string().optional(),
    avatar: vine.any()
})

</script>