<script lang="ts" setup>

const links = [
  {
    icon: 'i-heroicons-home',
    label: "Home",
    to: "/admin",
  },
  {
    icon: 'i-heroicons-cube',
    label: "Pages",
    to: "/admin/pages",
  },
  {
    icon: 'i-fluent-content-view-24-regular',
    label: "Posts",
    to: "/admin/posts",
  },

  {
    icon: 'i-heroicons-cube',
    label: "Media",
    to: "/admin/media",
  },
];

</script>

<template>
  <div class="fixed inset-0 flex overflow-hidden">
    <SidebarPanel :links="links">
      <template #top>

        <UIcon name="i-mdi:cube" />
        <span class="text-white">John Doe</span>

      </template>
    </SidebarPanel>
    <div class="flex flex-1 w-full">
      <div class="flex-col items-stretch relative w-full lg:w-[--width] flex-1 flex">

        <main>



          <slot />
        </main>

      </div>
    </div>

  </div>
</template>

<style scoped></style>
