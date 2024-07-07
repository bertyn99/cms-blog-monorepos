<script setup lang="ts">
import type { TiptapEditor } from '#imports';
import type { ShallowRef } from 'vue';



const { editor } = defineProps<{ editor: TiptapEditor }>()


//dropdown type of text
const items = [
    {
        label: "p",
        icon: "i-material-symbols-light-format-paragraph",
        click: () => {
            editor?.chain().focus().setParagraph().run();
        },
    },

    {

        label: "h1",
        icon: "i-ci-heading-h1",
        click: () => {
            console.log(editor)
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
        },
    },

    {
        label: "H2",
        icon: "i-ci-heading-h2",
        click: () => {
            console.log(editor);
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
        },
    },

    {
        label: "h3",
        icon: "i-ci-heading-h3",
        click: () => {
            console.log(editor);
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
        },
    },

    {
        label: "h4",
        icon: "i-ci-heading-h4",
        click: () => {
            console.log(editor);
            editor?.chain().focus().toggleHeading({ level: 4 }).run();
        },

    },

    {
        label: "h5",
        icon: "i-ci-heading-h5",
        click: () => {
            console.log(editor);
            editor?.chain().focus().toggleHeading({ level: 5 }).run();
        },
    },
];

const selected = ref(items[0]);

watch(selected, (value) => {

    value.click();
});

const setLink = () => {
    if (!editor) {
        return null;
    }
    const previousUrl = editor.getAttributes("link").href;
    /*     const url = window.prompt("URL", previousUrl);
     */
    // cancelled
    if (previousUrl === null) {
        return;
    }

    // empty
    if (previousUrl === "") {
        editor.chain().focus().extendMarkRange("hyperlink")?.unsetHyperlink().run();
        return;
    }

    // update link
    editor.chain().focus().extendMarkRange("hyperlink")?.setHyperlink().run();
};


//search and replace
const searchTerm = ref<string>("tiptap");

const replaceTerm = ref<string>("");

const caseSensitive = ref<boolean>(false);

const updateSearchReplace = (clearIndex: boolean = false) => {
    if (!editor) return;

    if (clearIndex) editor.commands.resetIndex();

    editor.commands.setSearchTerm(searchTerm.value);
    editor.commands.setReplaceTerm(replaceTerm.value);
    editor.commands.setCaseSensitive(caseSensitive.value);
};

const goToSelection = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const position: Range = results[resultIndex];

    if (!position) return;

    editor.commands.setTextSelection(position);

    const { node } = editor.view.domAtPos(
        editor.state.selection.anchor
    );
    node instanceof HTMLElement &&
        node.scrollIntoView({ behavior: "smooth", block: "center" });
};


watch(
    () => searchTerm.value.trim(),
    (val, oldVal) => {
        if (!val) clear();
        if (val !== oldVal) updateSearchReplace(true);
    }
);

watch(
    () => replaceTerm.value.trim(),
    (val, oldVal) => (val === oldVal ? null : updateSearchReplace())
);

watch(
    () => caseSensitive.value,
    (val, oldVal) => (val === oldVal ? null : updateSearchReplace(true))
);

const replace = () => {
    editor?.commands.replace();
    goToSelection();
};

const next = () => {
    editor?.commands.nextSearchResult();
    goToSelection();
};

const previous = () => {
    editor?.commands.previousSearchResult();
    goToSelection();
};

const clear = () => {
    searchTerm.value = replaceTerm.value = "";
    editor.commands.resetIndex();
};

const replaceAll = () => editor?.commands.replaceAll();

onMounted(() => setTimeout(updateSearchReplace));
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
        <UButton @click="setLink" :class="{ 'is-active': editor.isActive('blockquote') }" variant="soft"
            icon="i-mdi-link-variant" class="flex-1">
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

    <div class="flex flex-col gap-6">
        <section class="flex gap-6">
            <div>
                <label for="search-term" class="block text-sm font-medium text-gray-700">Search</label>
                <div class="mt-1">
                    <input v-model="searchTerm" @keydown.enter.prevent="updateSearchReplace" type="text"
                        placeholder="Search..." autofocus="true"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>

            <div>
                <label for="search-term" class="block text-sm font-medium text-gray-700">Replace</label>
                <div class="mt-1">
                    <input v-model="replaceTerm" @keydown.enter.prevent="replace" type="text" placeholder="Replace..."
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>

            <div>
                <label for="search-term" class="block text-sm font-medium text-gray-700">Case sensitive</label>
                <div class="mt-1">
                    <input v-model="caseSensitive" @input="updateSearchReplace" type="checkbox"
                        class="border-gray-300 rounded-md shadow-sm w-5 h-5 mt-2" />
                </div>
            </div>
        </section>

        <span class="inline-flex rounded-md isolate">
            <button @click="clear" type="button"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                Clear
            </button>
            <button @click="previous" type="button"
                class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                Previous
            </button>
            <button @click="next" type="button"
                class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                Next
            </button>
            <button @click="replace" type="button"
                class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                Replace
            </button>
            <button @click="replaceAll" type="button"
                class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                Replace All
            </button>

            <div class="block text-sm font-medium text-gray-700 py-2 px-4">
                Results: {{ editor?.storage?.searchAndReplace?.resultIndex + 1 }} / {{
                    editor?.storage?.searchAndReplace?.results.length }}
            </div>
        </span>
    </div>
</template>