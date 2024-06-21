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

            <UForm ref="form" :state="state" class="space-y-6" @submit="onSubmit" :validate="validate">
                <UFormGroup v-for="field in fields" :key="field.label" :label="field.label" :name="field.name">
                    <UInput v-if="field.type !== 'textarea'" v-model="state[field.name]"
                        :placeholder="field.placeholder" :type="field.type" />
                    <UTextarea v-else v-model="state[field.label.toLowerCase()]" :placeholder="field.placeholder" />

                </UFormGroup>

                <UButton type="submit" :disabled="loading" block>
                    Submit
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { PropType } from '#imports';
import vine, { errors } from '@vinejs/vine';
import type { User } from '~/types/auth-form';
import type { FormError, FormErrorEvent } from '#ui/types'


const { member } = defineProps({
    member: {
        type: Object as PropType<User>,
        required: true,
    },
});

const isOpen = defineModel('isOpen', { type: Boolean, default: false })

const fields = [
    {
        name: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "John De",

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
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Enter your password",
    },
    {
        name: "bio",
        type: "textarea",
        label: "Bio",
        placeholder: "Few sentence about you",

    },
];

const loading = ref(false);
//generate a reactive state object that adapts with the fields
const state = reactive<{ [key: string]: any }>(
    {
        fullName: member?.fullName,
        email: member?.email,
        password: null,
        confirmPassword: null,
        bio: member?.bio,
        avatar: member?.avatar,
    }
);


const schema = vine.object({
    fullName: vine.string().minLength(4),
    email: vine.string().email(),
    password: vine
        .string()
        .minLength(8)
        .maxLength(32).confirmed().optional(),
    bio: vine.string().optional(),
    avatar: vine.any().optional()
})

const validate = async (state: any) => {
    const errorsR: FormError[] = [];
    try {
        const validator = vine.compile(schema)
        await validator.validate(
            state
        )
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            error.messages.forEach((message: any) => {
                errorsR.push({
                    path: message.field,
                    message: message.message,
                });
            });
        }
    }
    return errorsR;
};

const onSubmit = async () => {
    loading.value = true;
    try {

        console.log(state)
        // await updateUser(state)
        /*   isOpen.value = false  */
    } catch (error) {
        console.log(error)
    }
    loading.value = false;
}
</script>