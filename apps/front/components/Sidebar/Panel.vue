<script lang="ts" setup>
const defineProps = {
  links: {
    type: Array,
    required: true,
  },
};
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
    class="flex-col items-stretch relative w-full lg:w-[250px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 hidden lg:flex">

    <div
      class="sticky top-0 z-40 h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 ">
      <slot name="top" />
    </div>
    <div class="px-4 py-4 pt-2 space-y-4">
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
