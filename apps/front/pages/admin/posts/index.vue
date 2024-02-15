<template>
    <main>
        <NuxtLayout name="default">


            post
        </NuxtLayout>
    </main>
</template>

<script lang="ts" setup>

type Post = {
    id: number;
    title: string;
    content: string;
    published: boolean;
    created_at: Date;
    updated_at: Date;
}
</script>
