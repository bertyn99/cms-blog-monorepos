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
const FileInPagesFolder = computed(() => file.value.filter(f => f.folder !== "default"))
const FileInDefaultFolder = computed(() => file.value.filter(f => f.folder === "default"))
</script>

<template>
    <UContainer class="space-y-8">
        <div class="mt-8">
            <h2 class="text-3xl font-bold">Folder</h2>
            <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                <MediaCard v-for="f in FileInPagesFolder" :name="f.folder" :image="f.media[0].link"
                    :link="f.media[0].link" />
            </div>
        </div>
        <UDivider />
        <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <MediaCard v-for="f in FileInDefaultFolder" :name="f.folder" :image="f.media[0].link"
                :link="f.media[0].link" />
        </div>
    </UContainer>


</template>