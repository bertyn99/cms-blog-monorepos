<script lang="ts" setup>
const { loggedIn, user, session, clear } = useUserSession()

const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const userRepo = userRepository($api);
const headers = useRequestHeaders(['cookie'])
console.log(headers)
const { data, error } = await useAsyncData('user', () => userRepo.getProfile())

console.log(error)
console.log(data)
</script>

<template>
  <main>
    <NuxtLayout name="default">
      <div v-if="loggedIn">
        <h1>Welcome {{ user?.fullName }}!</h1>
        <p>Logged in since {{ session?.user!.createdAt }}</p>
        <button @click="clear">Logout</button>
      </div>

      <div v-else>
        <h1>Not logged in</h1>

      </div>
    </NuxtLayout>
  </main>
</template>

<style scoped></style>
