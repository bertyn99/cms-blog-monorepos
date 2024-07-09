  <template>
    <div class="my-4">
      <EditorMenuBar :editor="editor" class="flex justify-center" />
      <TiptapEditorContent :editor="editor"
        class="border-2 bg-white dark:bg-gray-900 min-h-[300px] p-4 w-full h-full max-h-96 overflow-y-auto relative" />
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
import { SearchAndReplace } from '~/tiptap/search_and_replace_extension/search_and_replace';


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
        "w-full prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-2 my-6 focus:outline-none text-gray-900 dark:text-white  ",
    },
  },
  extensions: [TiptapStarterKit.configure({/*  codeBlock false, */ }), /* CodeBlockShiki.configure({
    }) */, TiptapImage, TiptapMarkdown,
  SearchAndReplace.configure({
    searchResultClass: "search-result", // class to give to found items. default 'search-result'
    caseSensitive: false, // no need to explain
    disableRegex: false, // also no need to explain
  }), Hyperlink.configure({
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

<style lang="postcss">
.search-result {
  @apply bg-yellow-200;

  &-current {
    @apply bg-green-300;
  }
}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .search-container {
    @apply flex items-center h-12 z-50 p-2 relative overflow-hidden w-full;
  }

  .close-button {
    @apply p-1 mr-2 bg-gray-100 rounded-full text-gray-700 hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-opacity-50;
  }

  .search-input {
    @apply flex-1 min-w-[4rem] px-2 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  .button-container {
    @apply absolute top-0 bottom-0 right-0 flex items-center h-full pr-2;
  }

  .search-button {
    @apply p-1 mr-2 text-blue-400 rounded-md hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-opacity-50;
  }

  .nav-button {
    @apply p-1 mr-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50;
  }

  .nav-button-last {
    @apply p-1 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50;
  }

  .icon {
    @apply w-5 h-5;
  }
}
</style>