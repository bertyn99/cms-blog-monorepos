<template>
    ddd
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const idPost = computed(() => route.params.id)
const localePost = computed(() => route.params.locale)
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api)

const { data, error } = await useAsyncData('list', () => postRepo.geTPostContentByLocale(Number(idPost.value), String(localePost.value)), {
    watch: [idPost, localePost]
})

console.log(data.value)
</script>
