<template>
  <UContainer class="mx-0 ">
    <div class="w-full flex py-6">
      <h1 class="flex-1">{{ post?.title }}</h1>

      <div class="space-x-5">
        <UButton label="Publish" @click="publishPost" variant="soft" />
        <UButton type="submit" label="Save" @click="onSubmit"  />
      </div>
    </div>
    <div class="flex gap-4">
      <div
        class="shadow-md rounded-sm bg-slate-50/25 flex-grow-2 basis-3/4 p-7"
      >
        <UForm :state="post"  ref="form">
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
            <UFormGroup label="Description" name="title" class="w-full">
              <UInput v-model="post.description" />
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
import type { FormError, FormSubmitEvent,Form } from "#ui/types";
import type { Post } from "@yggdra/shared";

const form = ref<Form<Post>>({} as Form<Post>);
const route = useRoute();
const idPost = computed(() => route.params.id);
const localePost = computed(() => route.params.locale);
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const postRepo = postRepository($api);

const { data, error } = await useAsyncData(
  "list",
  () =>
    postRepo.getPostContentByLocale(
      Number(idPost.value),
      String(localePost.value)
    ),
  {
    watch: [idPost, localePost],
  }
);

let post: Post = reactive({} as Post);
if (data.value) {
   post={...data.value}
}

const publishPost = async () => {
  /* const response = await postRepo.publishPost(Number(idPost.value), String(localePost.value))
    console.log(response) */
};

async function onSubmit() {
  // Do something with data
  const data=await form.value.validate()
console.log(data);
}



</script>
