<script setup>
definePageMeta({
    name: "Media Librairy",
});

const file = ref([
    {
        folder: "pages",
        media: [{
            name: "toto.png",
            type: "file",
            size: "1.2kb",
            date: "2021-10-10",
            link: "/media/pages/toto.png"
        }]
    },
    {
        folder: "articles",
        media: [{
            name: "tata.png",
            type: "file",
            size: "1.2kb",
            date: "2021-10-10",
            link: "/media/articles/toto.png"
        }]
    },
    {
        folder: "default",
        media: [{
            name: "titi.png",
            type: "file",
            size: "1.2kb",
            date: "2021-10-10",
            link: "/media/default/toto.png"
        }]
    }
])
const FileInPagesFolder = computed(() => file.value.filter(f => f.folder === "pages"))
const FileInDefaultFolder = computed(() => file.value.filter(f => f.folder === "default"))
</script>

<template>
    <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        <MediaCard v-for="f in file" :name="f.folder" :image="f.media[0].link" :link="f.media[0].link" />
    </div>
</template>