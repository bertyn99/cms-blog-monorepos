<script lang="ts" setup>
const { breadcrumbs } = useBreadcrumbs()
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
        <div
          class="sticky top-0 z-40 h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4">
          <div class="flex items-center justify-between flex-1 gap-x-1.5">
            <UBreadcrumb :links="breadcrumbs" />
            <div class="flex items-center gap-x-4">
              <UButton size="sm" icon="i-mdi:bell" />
              <UButton size="sm" icon="i-mdi:settings" />
              <UButton size="sm" icon="i-mdi:account" />
            </div>
            <slot name="header" />

          </div>
        </div>

        <slot />
      </div>
    </div>

  </div>
</template>

<style scoped></style>
