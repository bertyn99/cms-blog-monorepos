<template>
  <UModal v-model="isOpen" :ui="{
    width: ' sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl',
  }">
    <UCard :ui="{
      base: 'h-full min-w-64 flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow',
      },
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Details File
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpen = false" />
        </div>
      </template>

      <div class="h-full flex gap-2">
        <div class="w-full md:basis-1/2">
          <div class="max-h-[1/2] w-full border-2 rounded-md flex flex-col">
            <div class="bg-gray-200 h-8 p-1 flex justify-end">
              <UButton size="sm" icon="i-heroicons-trash-solid" color="red" variant="ghost" @click="deleteFile" />
            </div>
            <div
              class="relative min-h-24 pattern-rectangles pattern-slate-200 pattern-bg-white pattern-size-6 pattern-opacity-100 overflow-hidden">
              <img class="mx-auto max-h-36 aspect-auto object-scale-down" :src="getUrlImg" v-if="canShowPreview" />
            </div>

            <div class="bg-gray-200 h-8"></div>
          </div>
        </div>
        <div class="w-full md:basis-1/2 flex flex-col gap-2 overflow-y-scroll">
          <div class="bg-gray-300 h-32 rounded-md">
            <div class="grid grid-cols-2 p-2 gap-y-3">
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 font-normal text-md">Type:</span>
                <span class="font-light text-sm">{{ file.mimeType }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 font-normal text-md">Size:</span>
                <span class="font-light text-sm">{{ file.size }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 font-normal text-md">Folder:</span>
                <span class="font-light text-sm">{{ file.folderId ?? "/" }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 font-normal text-md">Created At:</span>
                <span class="font-light text-sm">{{ file.createdAt }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-md bg-gray-200 h-72">
            <UForm class="p-2.5 space-y-3" :state="state">
              <UFormGroup label="Name" name="name">
                <UInput v-model="state.file_name" />
              </UFormGroup>
              <UFormGroup label="Alternative Text" name="alt">
                <UInput v-model="state.alt" />
                <p class="text-sm text-gray-500">
                  Alternative text describes your images and media files.</p>
              </UFormGroup>
              <UFormGroup label="Caption" name="caption">
                <UInput v-model="state.caption" />
              </UFormGroup>
            </UForm>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <UButton color="gray" variant="ghost" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton color="primary" @click="updateFile"> Save </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { File } from '~/types/media'

const route = useRoute()

const folderName = computed(() => route.query.folder ?? "/")


const isOpen = defineModel();

const { file } = defineProps({
  file: {
    type: Object as PropType<File>,
    required: true,
  },
});


const state = reactive({
  file_path: file.filePath,
  file_name: file.fileName,
  alt: file.alt,
  caption: file.caption,
  mimeType: file.mimeType,
  folderId: file.folderId,
  size: file.size,
})
const canShowPreview = computed(() => {
  //check if the file has png/jpg/jpeg extension
  return ["png", "jpg", "jpeg"].includes(file.mimeType);
});

const getUrlImg = computed(() => {
  const config = useRuntimeConfig();
  return config.public.api + "/" + file.filePath;
});

const updateFile = async () => {

  const { updateMedia, loading } = useMediaLibrary();

  await updateMedia(file.id, state)
  isOpen.value = false
}

const deleteFile = async () => {
  const { deleteMedia, loading } = useMediaLibrary();
  try {
    await deleteMedia(file.id)
    await refreshNuxtData(`list-media-${folderName.value}`)
    isOpen.value = false
  } catch (error) {

  }




}
</script>
