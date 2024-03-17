<template>
  <UContainer class="mx-0 ">
    <div class="w-full flex py-6">
      <h1 class="flex-1">{{ newPost?.title == '' ? " Post Title" : newPost?.title }}</h1>

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
      <div class="shadow-md rounded-sm bg-slate-50/25 basis-1/4 flex flex-col px-2.5 py-4 gap-3">


        <span id="additional-information"
          class=" font-semibold uppercase align-baseline border-0 text-slate-500 text-[.65rem] ">Internationalization</span>
        <UDivider />
        <UFormGroup label="Locale">
          <USelectMenu v-model="selectedLocale" :options="localTranslationState">
            <template #option="{ option }">
              <span
                :class="[option.exist ? 'bg-green-400' : 'bg-gray-200', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']"
                aria-hidden="true" />
              <span class="truncate">{{ option.label }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
      </div>
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

const { locale } = route.query
const localePost = computed(() => (locale ?? 'fr') as string)
const { selectedLocale, setSelectedLocale, localTranslationState } = await useLocale()
const newPost = reactive<NewPost>({
  title: '',
  description: '',
  slug: '',
  content: '',
  locale: localePost.value,
  published: false,
  status: "Draft" as PostStatus.DRAFT,
  seo: null
})
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
