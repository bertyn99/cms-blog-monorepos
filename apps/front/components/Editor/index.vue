<template>
  <div>
    <div v-if="editor">
      <UUButton
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        icon="i-heroicon-bold"
      >
        bold
      </UUButton>
      <UButton
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        icon="i-heroicon-italic"
      >
        italic
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        icon="i-mdi-format-strikethrough"
      >
        strike
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        icon="i-heroicon-code-bracket"
      >
        code
      </UButton>
      <UButton
        @click="editor.chain().focus().unsetAllMarks().run()"
        icon="i-material-symbols-format-clear"
      >
        clear marks
      </UButton>
      <UButton
        @click="editor.chain().focus().clearNodes().run()"
        icon="i-heroicon"
      >
        clear nodes
      </UButton>
      <UButton
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        icon="i-material-symbols-light-format-paragraph"
      >
        paragraph
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        icon="i-ci-heading-h1"
      >
        h1
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        icon="i-ci-heading-h2"
      >
        h2
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        icon="i-ci-heading-h3"
      >
        h3
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        icon="i-ci-heading-h4"
      >
        h4
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        icon="i-ci-heading-h5"
      >
        h5
      </UButton>

      <UButton
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        icon="i-streamline-interface-text-formatting-list-bullets-points-bullet-unordered-list-lists-bullets"
      >
        bullet list
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        icon="i-mdi-order-numeric-descending"
      >
        ordered list
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        icon="i-heroicon"
      >
        code block
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        icon="i-tabler-blockquote"
      >
        blockquote
      </UButton>
      <UButton
        @click="editor.chain().focus().setHorizontalRule().run()"
        icon="i-heroicon"
      >
        horizontal rule
      </UButton>
      <UButton
        @click="editor.chain().focus().setHardBreak().run()"
        icon="i-heroicon"
      >
        hard break
      </UButton>
      <UButton
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        icon="i-mdi-undo"
      >
        undo
      </UButton>
      <UButton
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        icon="i-mdi-redo"
      >
        redo
      </UButton>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
const { content } = defineProps({
  content: String,
});
console.log(content);
const editor = useEditor({
  content: content,
  extensions: [TiptapStarterKit],
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>
