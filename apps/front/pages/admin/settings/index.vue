<script setup lang="ts">

import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
    name: 'Settings'
})

const fileRef = ref<HTMLInputElement>()
const isDeleteAccountModalOpen = ref(false)
const { loggedIn, user, updateUser } = useUserSession()

const { selectedTheme, optionsTheme } = useTheme()

const state = reactive({
    name: user.value?.fullName || '',
    email: user.value?.email || '',
    username: user.value?.fullName,
    avatar: user.value?.avatar || '',
    bio: user.value?.bio || '',
    password_current: '',
    password_new: ''
})

watch(user, (value) => {
    console.log(value)
    state.name = value?.fullName || ''
    state.email = value?.email || ''
    state.avatar = value?.avatar || ''
    state.bio = value?.bio || ''
})

const toast = useToast()

function validate(state: any): FormError[] {
    const errors = []
    if (!state.name) errors.push({ path: 'name', message: 'Please enter your name.' })
    if (!state.email) errors.push({ path: 'email', message: 'Please enter your email.' })
    if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new)) errors.push({ path: 'password', message: 'Please enter a valid password.' })
    return errors
}

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement

    if (!input.files?.length) {
        return
    }

    state.avatar = URL.createObjectURL(input.files[0])
}

function onFileClick() {
    fileRef.value?.click()
}

async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with data
    console.log(event.data)
    updateUser(event.data)
    toast.add({ title: 'Profile updated', icon: 'i-heroicons-check-circle' })
}

const ui = /* ui */ {
    constrained: '',
}

</script>

<template>
    <UContainer :ui="ui">

        <div class="flex  justify-between py-2">
            <div>
                <h2 class=" text-gray-900 dark:text-white font-semibold">Theme Preference</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Customize the look and feel of your dashboard.
                </p>
            </div>
            <USelectMenu :options="optionsTheme" v-model="selectedTheme" class="w-32">
                <template #leading>
                    <UIcon v-if="selectedTheme.icon" :name="(selectedTheme.icon as string)" class="w-5 h-5" />
                </template>
            </USelectMenu>
        </div>
        <UDivider class="mb-4" />

        <UForm :state="state" :validate="validate" :validate-on="['submit']" @submit="onSubmit">
            <div class="flex  justify-between py-2">
                <div>
                    <h2 class=" text-gray-900 dark:text-white font-semibold">Profile</h2>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your profile information.</p>
                </div>
                <UButton type="submit" label="Save changes" color="black" class="h-8" />
            </div>

            <UDivider class="mb-4" />
            <UFormGroup name="name" label="Name"
                description="Will appear on receipts, invoices, and other communication." required
                class="grid grid-cols-2 gap-2 items-center py-2" :ui="{ container: '' }">
                <UInput v-model="state.name" autocomplete="off" icon="i-heroicons-user" size="md" />
            </UFormGroup>
            <UDivider class="mb-4" />
            <UFormGroup name="email" label="Email"
                description="Used to sign in, for email receipts and product updates." required
                class="grid grid-cols-2 gap-2 py-2" :ui="{ container: '' }">
                <UInput v-model="state.email" type="email" autocomplete="off" icon="i-heroicons-envelope" size="md" />
            </UFormGroup>
            <UDivider class="mb-4" />
            <UFormGroup name="avatar" label="Avatar" class="grid grid-cols-2 gap-2 py-2"
                help="JPG, GIF or PNG. 1MB Max." :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }">
                <UAvatar :src="state.avatar" :alt="state.name" size="lg" />
                <UButton label="Choose" color="white" size="md" @click="onFileClick" />
                <input ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange">
            </UFormGroup>
            <UDivider class="mb-4" />
            <UFormGroup name="bio" label="Bio" description="Brief description for your profile. URLs are hyperlinked."
                class="grid grid-cols-2 gap-2 py-2" :ui="{ container: '' }">
                <UTextarea v-model="state.bio" :rows="5" autoresize size="md" />
            </UFormGroup>
            <UFormGroup name="password" label="Password"
                description="Confirm your current password before setting a new one."
                class="grid grid-cols-2 gap-2 py-2" :ui="{ container: '' }">
                <UInput id="password" v-model="state.password_current" type="password" placeholder="Current password"
                    size="md" />
                <UInput id="password_new" v-model="state.password_new" type="password" placeholder="New password"
                    size="md" class="mt-2" />
            </UFormGroup>
        </UForm>
        <UDivider class="mb-4" />
        <div>
            <div>
                <UButton color="red" label="Delete account" variant="soft" size="md"
                    @click="isDeleteAccountModalOpen = true" />
            </div>
            <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
        </div>
    </UContainer>
</template>