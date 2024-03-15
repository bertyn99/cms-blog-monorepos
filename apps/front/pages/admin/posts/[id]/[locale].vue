<template>

  <UContainer class="mx-0 ">
    <div class="w-full flex py-6">
      <h1 class="flex-1">{{ post?.title }}</h1>

      <div class="space-x-5">
        <UButton :label="labelTogglePublish" @click="togglePublishing" variant="soft" :loading="pending || loading" />
        <UButton type="submit" label="Save" @click="onSubmit" :loading="pending || loading" />
      </div>
    </div>
    <div class="flex gap-4">
      <div class="shadow-md rounded-sm bg-slate-50/25 flex-grow-2 basis-3/4 p-7">
        <UForm :state="post" ref="form">
          <div class="flex gap-4">
            <UFormGroup label="Title" name="title" class="w-full">
              <UInput v-model="post.title" />
            </UFormGroup>
            <UFormGroup label="Description" name="title" class="w-full">
              <UInput v-model="post.description" />
            </UFormGroup>
          </div>
          <div class="flex gap-4">
            <UFormGroup label="Slug" name="slug" class="w-full">
              <UInput v-model="post.slug" />
            </UFormGroup>

          </div>
          <ClientOnly fallback-tag="span" fallback="Loading Editor...">
            <Editor v-model:content="post.content" />
          </ClientOnly>
          <!-- <UButton type="submit" label="Save" /> -->
        </UForm>
      </div>
      <div class="shadow-md rounded-sm bg-slate-50/25 basis-1/4">dd</div>
    </div>
  </UContainer>

</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent, Form } from "#ui/types";
import type { Post, PostStatus } from "@yggdra/shared";

definePageMeta({
  middleware: ['auth-guard']
})

const form = ref<Form<Post>>({} as Form<Post>);
const route = useRoute();
const idPost = computed(() => route.params.id);
const localePost = computed(() => route.params.locale);

const labelTogglePublish = computed(() => post.value.status === "Published" as PostStatus.PUBLISHED ? 'Unpublish' : 'Publish')
const toast = useToast()
const loading = ref(false)
const { $api } = useNuxtApp();
const post = ref<Post>({
  id: 0,
  title: '',
  postId: 0,
  description: '',
  slug: '',
  content: '',
  locale: '',
  published: false,
  status: "Draft" as PostStatus.DRAFT,
  seo: null
});

const postRepo = postRepository($api);
const headers = useRequestHeaders(['cookie'])
const { data, error, pending } = await useAsyncData(
  `post-${idPost.value}-${localePost.value}`,
  () =>
    postRepo.getPostContentByLocale(
      Number(idPost.value),
      String(localePost.value),
      headers
    ),
  {
    watch: [idPost, localePost],
  }
);

if (!pending.value && data?.value !== null) {

  post.value = data.value

}

const togglePublishing = async () => {
  console.log('togglePublishing', post.value.status)
  if (post.value.status == "Published" as PostStatus.PUBLISHED) {
    await unpublishPost()
  } else {
    await publishPost()
  }

}

const publishPost = async () => {
  try {
    loading.value = true
    const response = await postRepo.publishPost([Number(post.value.id)], String(localePost.value))

    if (response.message) {
      loading.value = false
      post.value.status = "Published" as PostStatus.PUBLISHED
    }
  } catch (error: any) {
    loading.value = false
    toast.add({
      id: `post-publish-error`,
      icon: 'i-heroicons-x-circle',
      title: 'Error publishing the post',
      color: 'red',
      description: error.message,

    })

  }
}


const unpublishPost = async () => {
  try {
    loading.value = true
    const response = await postRepo.unpublishPost([Number(post.value.id)])

    if (response.message) {
      loading.value = false
      post.value.status = "Draft" as PostStatus.DRAFT
    }
  } catch (error: any) {
    loading.value = false
    toast.add({
      id: `post-publish-error`,
      icon: 'i-heroicons-x-circle',
      title: 'Error publishing the post',
      color: 'red',
      description: error.message,

    })
  }
}

async function onSubmit() {
  // Do something with data
  const dataForm = await form.value.validate()

  if (dataForm) {
    try {
      loading.value = true
      const response = await postRepo.updatePost(Number(dataForm.postId), dataForm)

      if (response) {
        loading.value = false
        toast.add({
          id: `post-updated-${response.postId}`,
          icon: 'i-heroicons-check-circle',
          color: 'green',
          title: 'Post updated',
        })
      }
    } catch (error: any) {
      loading.value = false
      toast.add({
        id: `post-updated-error`,
        icon: 'i-heroicons-x-circle',
        title: 'Error updating the post',
        color: 'red',
        description: error.message,

      })
    }

  }
}



</script>
