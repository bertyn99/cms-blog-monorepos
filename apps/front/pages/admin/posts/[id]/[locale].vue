<template>
  <UContainer class="mx-0">
    <div class="w-full flex py-6">
      <h1 class="flex-1">{{ data?.title }}</h1>

      <div class="space-x-5">
        <UButton label="Publish" @click="publishPost" variant="soft" />
        <UButton label="Save" @click="publishPost" disabled />
      </div>
    </div>

    <div class="flex gap-4">
      <div
        class="shadow-md rounded-sm bg-slate-50/25 flex-grow-2 basis-3/4 p-7"
      >
        <UForm :state="post" @submit="onSubmit">
          <div class="flex gap-4">
            <UFormGroup label="Title" name="title" class="w-full">
              <UInput v-model="post.title" />
            </UFormGroup>
            <UFormGroup label="Description" name="title" class="w-full">
              <UInput v-model="post.description" />
            </UFormGroup>
          </div>
          <div class="flex gap-4">
            <UFormGroup label="Title" name="title" class="w-full">
              <UInput v-model="post.title" />
            </UFormGroup>
            <UFormGroup label="Description" name="title" class="w-full">
              <UInput v-model="post.description" />
            </UFormGroup>
          </div>
          <Editor v-model="post.content" />
        </UForm>
      </div>
      <div class="shadow-md rounded-sm bg-slate-50/25 basis-1/4">dd</div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { Post } from "@yggdra/shared";

const route = useRoute();
const idPost = computed(() => route.params.id);
const localePost = computed(() => route.params.locale);
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api);

const { data, error } = await useAsyncData(
  "list",
  () =>
    postRepo.geTPostContentByLocale(
      Number(idPost.value),
      String(localePost.value)
    ),
  {
    watch: [idPost, localePost],
  }
);
console.log(data.value);
const post: Post = reactive({} as Post);
if (data.value) {
  const { createdAt, updatedAt, ...postData } = data.value;

  const post = reactive(postData);
}

const publishPost = async () => {
  /* const response = await postRepo.publishPost(Number(idPost.value), String(localePost.value))
    console.log(response) */
};

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data);
}
</script>
