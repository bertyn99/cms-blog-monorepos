<script lang="ts" setup>
const links = [
  {
    label: "Vertical Navigation",
    to: "/components/vertical-navigation",
  },
  {
    label: "Command Palette",
    to: "/components/command-palette",
  },
  {
    label: "Table",
    to: "/components/table",
  },
];
</script>
<template>
  <div
    class="hidden sm:block fixed left-0 top-0 bottom-0 w-64 dark:bg-white/5 backdrop-blur"
  >
    <div class="px-4 pt-2 space-y-4">
      <slot name="top" />
      <UVerticalNavigation :links="links">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{
            link.label
          }}</span>
        </template>
      </UVerticalNavigation>
    </div>
  </div>
</template>
