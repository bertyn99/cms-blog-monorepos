<template>

    <DashboardNavbar>

        <template #right>
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="New Post" trailing variant="soft"
                to="/admin/posts/new" />



        </template>

    </DashboardNavbar>


    <div class="flex p-5">
        <UInputMenu v-model="selectedLocale" :options="lang" />
    </div>

    <UTable :columns="columns" :rows="formatedDataArray" v-model="selectedPost" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">

        <template #actions-data="{ row }">
            <div class="flex">
                <UButton :to="`/admin/posts/${row.postId}/${selectedLocale?.locale}`" class="mr-1"
                    icon="i-heroicons-pencil-square-20-solid" prefetch>
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
        locale: 'es'
    },
    {
        label: 'Italian(IT)',
        locale: 'it'
    },

]

const isOpen = ref(false)
const selectedLocale = ref(lang[0])

const { $api } = useNuxtApp();
const toast = useToast()
const postRepo = postRepository($api);
const loading = ref(false)

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

const headers = useRequestHeaders(['cookie'])
const { data, error, pending, refresh } = await useAsyncData(`list-${selectedLocale.value.locale
    }`, () => postRepo.getAllPostBylocal({
        headers,
        params: {
            locale: selectedLocale.value.locale
        }
    }), {
    watch: [selectedLocale]
})

const deletePost = async (id: string) => {
    try {
        loading.value = true
        const res = await postRepo.deletePost(Number(id))
        if (res) {
            loading.value = false
            toast.add({
                id: `post-deleted-${id}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: 'Post deleted',
            })
            await refresh()

        }
    } catch (error: any) {
        loading.value = false
        toast.add({
            id: `post-deleted-error`,
            color: 'red',
            icon: 'i-heroicons-x-circle',
            title: 'Error deleting post',
            description: error.message,
        })
    }

}


const formatedDataArray = computed(() => {
    if (data.value && data.value?.data.length > 0) {
        return data.value?.data.map(item => {
            const { locale, ...rest } = item;
            return rest
        })
    }
    return []
});



</script>
