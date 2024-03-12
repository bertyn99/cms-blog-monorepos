<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  layout: "auth",

});

useSeoMeta({
  title: "Login",
});


const fields = [
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
];


/* const providers = [
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    color: "white" as const,
    click: () => {
      console.log("Redirect to GitHub");
    },
  },
  {
    label: "Google",
    icon: "i-simple-icons-google",
    color: "white" as const,
    click: () => {
      console.log("Redirect to GitHub");
    },
  },
]; */

const { $api } = useNuxtApp();
const loading = ref(false);
const config = useRuntimeConfig();
const userRepo = userRepository($api);
const { fetchAndSetUser, loggedIn } = useUserSession();

await fetchAndSetUser();

if (loggedIn.value) {
  navigateTo("/admin");
}


async function onSubmit(form: any) {
  try {
    loading.value = true;
    const data = await userRepository($api).login(form.email, form.password);

    if (data) {
      loading.value = false;
      fetchAndSetUser();

    }
    navigateTo("/admin");

  } catch (error) {
    loading.value = false;
    console.log('error', error);
  }


}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <AuthForm :fields="fields" title="Connecter vous" align="top" icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }" submit-button="Sign-in" @submit="onSubmit">
      <template #description>

      </template>

      <!-- <template #password-hint>
        <NuxtLink to="/" class="text-primary font-medium"
          >Forgot password?</NuxtLink
        >
      </template>

        <template #footer>
        By signing in, you agree to our
        <NuxtLink to="/" class="text-primary font-medium"
          >Terms of Service</NuxtLink
        >. </template
      > -->
    </AuthForm>
  </UCard>
</template>
