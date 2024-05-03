<template>
    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ">
        <div class="text-center">
            <Icon name="i-mdi-multimedia" class="w-12 h-12 text-gray-300" />
            <div class="mt-4 flex text-sm leading-6 text-gray-600">
                <label for="file-upload"
                    class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                    <span>Upload a file</span>

                    <UInput @change="addFiles" type="file" size="sm" id="file-upload" name="file-upload" multiple
                        class="sr-only" />
                </label>
                <p class="pl-1">or drag and drop</p>

            </div>
            <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
    </div>
</template>

<script setup>

const files = defineModel()

const addFiles = (event) => {
    files.value = Array.from(event.target.files)
}
</script>