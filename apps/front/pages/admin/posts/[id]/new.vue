<template>
  <UContainer class="mx-0 ">
    <div class="w-full flex py-6">
      <h1 class="flex-1 capitalize font-bold text-lg">Create "{{ selectedLocale.label }}" Translation for Post n°{{
        idPost }}
      </h1>

      <div class="space-x-5">
        <UButton label="Publish" @click="publishPost" variant="soft" disabled />
        <UButton type="submit" label="Save" @click="onSubmit" :loading="loading" />
      </div>
    </div>
    <div class="flex gap-4">
      <div class="shadow-md rounded-sm bg-slate-50/25 flex-grow-2 basis-3/4 p-7">
        <UForm :state="newPost" ref="form">
          <div class="flex gap-4">
            <UFormGroup label="Title" name="title" class="w-full">
              <UInput v-model="newPost.title" />
            </UFormGroup>
            <UFormGroup label="Description" name="title" class="w-full">
              <UInput v-model="newPost.description" />
            </UFormGroup>
          </div>
          <div class="flex gap-4">
            <UFormGroup label="Slug" name="slug" class="w-full">
              <UInput v-model="newPost.slug" />
            </UFormGroup>
          </div>
          <ClientOnly fallback-tag="span" fallback="Loading Editor...">
            <Editor v-model:content="newPost.content" />
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
import type { Post, NewPost, PostStatus } from "@yggdra/shared";

definePageMeta({
  middleware: ['auth-guard']
})

const form = ref<Form<Post>>({} as Form<NewPost>);
const route = useRoute();
const localePost = computed(() => route.query.locale);
const idPost = computed(() => route.params.id);
const { selectedLocale, setSelectedLocale, localTranslationState } = await useLocale()


setSelectedLocale(localePost.value)
const newPost = reactive({
  postId: idPost,
  title: '',
  description: '',
  slug: '',
  content: '',
  locale: localePost.value as string,
  published: false,
  status: "Draft" as PostStatus.DRAFT,
  seo: null
});

const { $api } = useNuxtApp();

const toast = useToast()
const loading = ref(false)
const postRepo = postRepository($api);

const publishPost = async () => {
  /* const response = await postRepo.publishPost(Number(idPost.value), String(localePost.value))
    console.log(response) */
};

async function onSubmit() {
  // Do something with data
  const data = await form.value.validate()
  const headers = useRequestHeaders(['cookie'])
  console.log(data);
  loading.value = true
  try {
    const post = await postRepo.createPost(newPost, headers)


    if (post) {
      loading.value = false
      navigateTo(`/admin/posts/${post.postId}/${post.locale}`)
      toast.add({
        id: `post-created-${post.id}`,
        icon: 'i-heroicons-check-circle',
        title: 'Post created',
      })
    }
  } catch (error: any) {
    loading.value = false
    console.error(error)
    toast.add({
      id: `post-created-error`,
      icon: 'i-heroicons-x-circle',
      title: 'Error creating post',
      color: 'red',
      description: error.message,

    })
  }
}



</script>
