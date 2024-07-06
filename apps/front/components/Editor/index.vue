<template>
  <div class="my-4">
    <EditorMenuBar :editor="editor" class="flex justify-center" />
    <TiptapEditorContent :editor="editor" class="border-2 bg-white dark:bg-gray-900 min-h-[300px] p-4 w-full h-full" />
  </div>

  <!-- https://cdn.dribbble.com/userupload/8828109/file/original-e23e44b4fcfb0773f922bc34c8b6e03d.png?resize=1200x900 -->
</template>

<script setup>
/* import CodeBlockShiki from 'tiptap-extension-code-block-shiki' */
import {
  Hyperlink
} from '@docs.plus/extension-hyperlink';
import { previewHyperlinkModal } from '~/utils/modal/previewHyperlink';
import { setHyperlinkModal } from '~/utils/modal/setHyperlink';


const props = defineProps({
  content: String,
  locale: String,
})


const emit = defineEmits(['update:content']);
const editor = useEditor({
  content: props.content,
  onUpdate: ({ editor }) => {
    // HTML
    emit('update:content', editor.storage.markdown.getMarkdown())

  },
  editorProps: {
    attributes: {
      class:
        "w-full prose my-6 mx-2 focus:outline-none text-gray-900 dark:text-white ",
    },
  },
  extensions: [TiptapStarterKit.configure({/*  codeBlock false, */ }), /* CodeBlockShiki.configure({
  }) */, TiptapImage, TiptapMarkdown, Hyperlink.configure({
    modals: {
      previewHyperlink: (data) => {
        return previewHyperlinkModal(props.locale, data);
      },
      setHyperlink: (data) => {
        return setHyperlinkModal(props.locale, data);
      },
    },
  })],
});

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});


</script>

<style scoped></style>