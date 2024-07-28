<template>

    <DashboardNavbar>

        <template #right>
            <UButton size="sm" icon="i-heroicons-plus-circle-16-solid" label="New Post" trailing variant="soft" :to="{
                path: '/admin/posts/new', query: {
                    locale: selectedLocale?.locale
                }
            }" />



        </template>

    </DashboardNavbar>


    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 gap-4">
        <UInputMenu v-model="selectedLocale" :options="localTranslationState" />

        <UButton @click="deleteSelectedPosts" color="red" icon="i-heroicons-trash-20-solid"
            v-if="selectedPost.length > 0" />

        <UButton @click="publishPosts" label="Publish" variant="soft" v-if="selectedPostDraft.length > 0" />
        <UButton @click="unPublishPosts" label="UnPublish" variant="soft" v-if="selectedPostPublished.length > 0" />
    </div>

    <UTable :columns="columns" :rows="formatedDataArray" v-model="selectedPost" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">


        <template #content="{ row }">
            <span class="truncate ">{{ row.content }}</span>
        </template>
        <template #actions-data="{ row }">
            <div class="flex">
                <UButton :to="`/admin/posts/${row.postId}/${selectedLocale?.locale}`" class="mr-1"
                    icon="i-heroicons-pencil-square-20-solid" prefetch>
                    <span class="sr-only">Edit</span>
                </UButton>

                <UButton @click="deletePost(row.postId)" color="red" icon="i-heroicons-trash-20-solid"><span
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


const isOpen = ref(false)


const { $api } = useNuxtApp();

const { selectedLocale, setSelectedLocale, localTranslationState } = await useLocale()
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
const selectedPostPublished = computed(() => selectedPost.value.filter((item: any) => item.status === 'Published'))
const selectedPostDraft = computed(() => selectedPost.value.filter((item: any) => item.status === 'Draft'))

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
        const res = await postRepo.deletePost(Number(id), selectedLocale.value.locale)
        console.log(res)
        if (res) {
            loading.value = false
            toast.add({
                id: `post-deleted-${id}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: res.message,
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

const publishPosts = async () => {
    const listOfSelectedPost: number[] = selectedPost.value.map(item => item.id)
    try {
        loading.value = true
        const res = await postRepo.publishPost(listOfSelectedPost, selectedLocale.value.locale)
        console.log(res)
        if (res) {
            loading.value = false
            toast.add({
                id: `post-published-${selectedPost.value}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: res.message,
            })
            await refresh()

        }
    } catch (error: any) {
        loading.value = false
        toast.add({
            id: `post-published-error`,
            color: 'red',
            icon: 'i-heroicons-x-circle',
            title: 'Error publishing post',
            description: error.message,
        })
    }

}

const unPublishPosts = async () => {
    const listOfSelectedPost: number[] = selectedPost.value.map(item => item.id)
    try {
        loading.value = true
        const res = await postRepo.unpublishPost(listOfSelectedPost, selectedLocale.value.locale)
        console.log(res)
        if (res) {
            loading.value = false
            toast.add({
                id: `post-published-${selectedPost.value}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: res.message,
            })
            await refresh()

        }
    } catch (error: any) {
        loading.value = false
        toast.add({
            id: `post-published-error`,
            color: 'red',
            icon: 'i-heroicons-x-circle',
            title: 'Error publishing post',
            description: error.message,
        })
    }

}

const deleteSelectedPosts = async () => {

    const listOfSelectedPost: number[] = selectedPost.value.map(item => item.id)
    try {
        loading.value = true
        const res = await postRepo.deleteListOfPost(listOfSelectedPost, selectedLocale.value.locale)
        console.log(res)
        if (res) {
            loading.value = false
            toast.add({
                id: `post-deleted-${selectedPost.value}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: res.message,
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
            // truncate content
            item.content = item.content.length > 45 ? item.content.substring(0, 45) + '...' : item.content
            return rest
        })
    }
    return []
});



</script>
