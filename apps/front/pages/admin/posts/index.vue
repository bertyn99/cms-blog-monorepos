<template>
    <div class="flex p-5">
        <UInputMenu v-model="selectedLocale" :options="lang" />
    </div>

    <UTable :columns="columns" :rows="formatedDataArray" v-model="selectedPost" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
        <template #actions-data="{ row }">
            <div class="flex">
                <UButton :to="`/admin/posts/${row.id}/${selectedLocale?.locale}`" class="mr-1"
                    icon="i-heroicons-pencil-square-20-solid">
                    <span class="sr-only">Edit</span>
                </UButton>

                <UButton @click="deletePost(row.id)" class="bg-red-500" icon="i-heroicons-trash-20-solid"><span
                        class="sr-only">Delete</span>
                </UButton>
            </div>
        </template>
    </UTable>
</template>

<script lang="ts" setup>
definePageMeta({
    name: 'Posts',
    middleware: ['auth-guard']
})
const lang = [
    {
        label: 'French(FR)',
        locale: 'fr'
    },
    {
        label: 'English(US)',
        locale: 'us'
    },
    {
        label: 'Spanish(SP)',
    },
    {
        label: 'Italian(IT)',
    },

]

const selectedLocale = ref(lang[0])

const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api);


const columns = [{
    key: 'id',
    label: '#'
}, {
    key: 'title',
    label: 'Title'
}, {
    key: 'content',
    label: 'Content'
}, {
    key: 'status',
    label: 'Status'
}, {
    key: 'updatedAt',
    label: 'Updated At'
}, {
    key: 'actions'
}]


const selectedPost = ref([])


const { data, error, pending } = await useAsyncData('list', () => postRepo.getAllPostBylocal({
    params: {
        locale: selectedLocale.value.locale
    }
}), {
    watch: [selectedLocale]
})


const deletePost = async (id: string) => {
    await postRepo.deletePost(Number(id))
    await useAsyncData('list', () => postRepo.getAllPostBylocal({
        params: {
            locale: selectedLocale.value.locale
        }
    }), {
        watch: [selectedLocale]
    })
}


const formatedDataArray = computed(() => {
    if (data.value && data.value?.data.length > 0) {
        return data.value?.data.map(item => {
            const { postId, locale, ...rest } = item;
            return rest
        })
    }
    return []
});



</script>
