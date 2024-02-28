<script lang="ts" setup>
definePageMeta({
  name: 'Dashboard',
  middleware: ['auth-guard']
})
const { loggedIn, user, clearUser } = useUserSession()



</script>

<template>
  <DashboardNavbar>


  </DashboardNavbar>
  <div v-if="loggedIn">
    <h1>Welcome {{ user?.fullName }}!</h1>
    <!--     <p>Logged in since {{ session?.user!.createdAt }}</p> -->
    <button @click="clearUser">Logout</button>
  </div>

  <div v-else>
    <h1>Not logged in</h1>

  </div>
</template>

<style scoped></style>
