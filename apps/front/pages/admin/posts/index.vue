<template>
    <main>
        <NuxtLayout name="default">
            <UTable :rows="data?.data" />
        </NuxtLayout>
    </main>
</template>

<script lang="ts" setup>

const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api)

const { data, error } = await useAsyncData('list', () => postRepo.getAllPostBylocal('fr'))
console.log(data.value)
</script>
