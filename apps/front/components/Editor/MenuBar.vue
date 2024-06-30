<script setup lang="ts">
import type { TiptapEditor } from '#imports';
import type { ShallowRef } from 'vue';



const { editor } = defineProps<{ editor: ShallowRef<TiptapEditor> }>()


//dropdown type of text
const items = [
    {
        label: "p",
        icon: "i-material-symbols-light-format-paragraph",
        click: () => {
            editor?.value?.chain().focus().setParagraph().run();
        },
    },

    {

        label: "h1",
        icon: "i-ci-heading-h1",
        click: () => {
            console.log(editor)
            editor?.value?.chain().focus().toggleHeading({ level: 1 }).run();
        },
    },

    {
        label: "H2",
        icon: "i-ci-heading-h2",
        click: () => {
            console.log(editor);
            editor?.value?.chain().focus().toggleHeading({ level: 2 }).run();
        },
    },

    {
        label: "h3",
        icon: "i-ci-heading-h3",
        click: () => {
            console.log(editor);
            editor?.value?.chain().focus().toggleHeading({ level: 3 }).run();
        },
    },

    {
        label: "h4",
        icon: "i-ci-heading-h4",
        click: () => {
            console.log(editor);
            editor?.value?.chain().focus().toggleHeading({ level: 4 }).run();
        },

    },

    {
        label: "h5",
        icon: "i-ci-heading-h5",
        click: () => {
            console.log(editor);
            editor?.value?.chain().focus().toggleHeading({ level: 5 }).run();
        },
    },
];

const selected = ref(items[0]);

watch(selected, (value) => {

    value.click();
});
</script>

<template>
    <div v-if="editor" class="flex shadow-sm bg-blue-50 dark:bg-blue-950">
        <USelectMenu :options="items" selected-icon="i-heroicons-hand-thumb-up-solid" v-model="selected"
            :ui="{ background: 'bg-blue-50 dark:bg-blue-950' }" class="w-full lg:w-32">
            <template #option="{ option: type }">
                <UIcon :name="type.icon" dynamic />
            </template>
        </USelectMenu>


        <UButton @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }" icon="i-heroicons-bold" :paddded="false" variant="soft"
            class="flex-1">
            <span class="sr-only">bold</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }" icon="i-heroicons-italic" variant="soft" class="flex-1">
            <span class="sr-only">italic</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }" icon="i-mdi-format-strikethrough" variant="soft"
            class="flex-1">
            <span class="sr-only">strike</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }" icon="i-material-symbols-format-ink-highlighter-rounded"
            variant="soft" class="flex-1">
            <span class="sr-only">code</span>
        </UButton>
        <UButton @click="editor.chain().focus().unsetAllMarks().run()" icon="i-material-symbols-format-clear"
            variant="soft" class="flex-1">
            <span class="sr-only">clear marks</span>
        </UButton>

        <UButton @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            icon="i-streamline-interface-text-formatting-list-bullets-points-bullet-unordered-list-lists-bullets"
            variant="soft" class="flex-1">
            <span class="sr-only">bullet list</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }" icon="i-mdi-order-numeric-descending"
            variant="soft" class="flex-1">
            <span class="sr-only">ordered list</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }" variant="soft" icon="i-heroicons-code-bracket"
            class="flex-1">
            <span class="sr-only">code block</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }" variant="soft" icon="i-tabler-blockquote"
            class="flex-1">
            <span class="sr-only">blockquote</span>
        </UButton>
        <UButton @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }" variant="soft" icon="i-ph-link-simple-bold"
            class="flex-1">
            <span class="sr-only">add Link</span>
        </UButton>

        <UButton @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()"
            variant="soft" icon="i-mdi-undo" class="flex-1">
            <span class="sr-only">undo</span>
        </UButton>
        <UButton @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()"
            variant="soft" icon="i-mdi-redo" class="flex-1">
            <span class="sr-only">redo</span>
        </UButton>
    </div>

</template>