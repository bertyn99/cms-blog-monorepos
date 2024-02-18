<template>
    <main>
        <NuxtLayout name="default">
            <div class="flex p-5">
                <UInputMenu v-model="selectedLocale" :options="lang" />
            </div>

            <UTable :rows="formatedDataArray" />
        </NuxtLayout>
    </main>
</template>

<script lang="ts" setup>

const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api)

const { data, error } = await useAsyncData('list', () => postRepo.getAllPostBylocal('fr'))
console.log(data.value)

const lang = [
    {
        label: 'French(FR)',
    },
    {
        label: 'English(EN)',
    },
    {
        label: 'Spanish(SP)',
    },
    {
        label: 'Italian(IT)',
    },

]

const selectedLocale = ref(lang[0])
const formatedDataArray = computed(() => data.value?.data.map(item => {
    const { postId, locale, ...rest } = item;
    return rest
}));
</script>
