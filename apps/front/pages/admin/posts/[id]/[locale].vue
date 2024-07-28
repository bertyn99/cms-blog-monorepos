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
            <Editor v-model:content="post.content" :locale="post.locale" />
          </ClientOnly>
          <!-- <UButton type="submit" label="Save" /> -->
        </UForm>
      </div>
      <div class="shadow-md rounded-sm bg-slate-50/25 basis-1/4 flex flex-col px-2.5 py-4 gap-3">
        <span id="additional-information"
          class=" font-semibold uppercase align-baseline border-0 text-slate-500 text-[.65rem] ">Information</span>
        <UDivider />
        <div class="my-4">

          <dl class=" leading-4 text-black align-baseline border-0 space-y-4">

            <div class="flex flex-row justify-between">
              <dt class=" text-xs font-semibold text-gray-700 align-baseline border-0" style="line-height: 1.33;">
                Created
              </dt>
              <dd class=" text-xs align-baseline border-0 text-slate-500" style="line-height: 1.33;">
                7 months ago
              </dd>
            </div>
            <div class="flex flex-row justify-between">
              <dt class=" text-xs font-semibold text-gray-700 align-baseline border-0" style="line-height: 1.33;">
                Last update
              </dt>
              <dd class=" text-xs align-baseline border-0 text-slate-500" style="line-height: 1.33;">
                5 months ago
              </dd>
            </div>
          </dl>
        </div>

        <div class="my-4 space-y-2">
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

        <div class="my-4 space-y-2">
          <span id="additional-information"
            class=" font-semibold uppercase align-baseline border-0 text-slate-500 text-[.65rem] ">Internationalization</span>
          <UDivider />
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" variant="soft"
              :label="date ? format(date, 'd MMM, yyy - HH:MM') : 'No scheduled date'" block />

            <template #panel="{ close }">
              <DatePicker v-model="date" mode="dateTime" is24hr />
            </template>
          </UPopover>
          <UButton label="Schedule" @click="schedulePost" :loading="pending || loading" block
            :disabled="date == null" />
        </div>
      </div>
    </div>
  </UContainer>

</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent, Form } from "#ui/types";
import type { Post, PostStatus } from "@yggdra/shared";
import { format } from 'date-fns'
definePageMeta({
  middleware: ['auth-guard']
})

const form = ref<Form<Post>>({} as Form<Post>);
const route = useRoute();
const idPost = computed(() => route.params.id);
const localePost = computed(() => route.params.locale);



const date = ref<Date | null>(null)
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

const { selectedLocale, setSelectedLocale, localTranslationState } = await useLocale(Number(idPost.value))

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
  console.log(data.value)
  post.value = data.value
  setSelectedLocale(String(localePost.value))
  date.value = data.value.publishedAt ? new Date(data.value.publishedAt) : null

}

const togglePublishing = async () => {
  if (post.value.status == "Published" as PostStatus.PUBLISHED) {
    await unpublishPost()
  } else {
    await publishPost()
  }

}

const schedulePost = async () => {
  try {
    loading.value = true
    const response = await postRepo.schedulePost([Number(post.value.id)], format(date.value ?? new Date(), 'd MMM, yyy - HH:MM'), headers)

    if (response) {
      loading.value = false
      toast.add({
        id: `post-schedule-${post.value.id}`,
        icon: 'i-heroicons-check-circle',
        color: 'green',
        title: 'Post scheduled',
      })
    }
  } catch (error: any) {
    loading.value = false
    toast.add({
      id: `post-schedule-error`,
      icon: 'i-heroicons-x-circle',
      title: 'Error scheduling the post',
      color: 'red',
      description: error.message,

    })
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
//watch if selectedLocale changes
watch(selectedLocale, async (newVal) => {
  if (newVal && newVal.exist) {
    const response = await postRepo.getPostContentByLocale(Number(idPost.value), newVal.locale, headers)
    if (response) {
      post.value = response

      //update query of the route
      navigateTo({ path: `/admin/posts/${idPost.value}/${newVal.locale}` })
    }
  } else {
    navigateTo({ path: `/admin/posts/${idPost.value}/new`, query: { locale: newVal.locale } })
  }
})

</script>
