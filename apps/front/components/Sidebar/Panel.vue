<script lang="ts" setup>
import type { PropType } from "vue";

const { links } = defineProps({
  links: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

const settingsLink = [
  {
    label: "General",
    to: "/admin/settings/general",
  },
  {
    label: "Users",
    to: "/admin/settings/users",
  },

]

const parent = {
  label: "Settings",
  defaultOpen: false
}

</script>
<template>
  <div
    class="flex-col items-stretch relative w-full lg:w-[250px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 hidden lg:flex">

    <div
      class="sticky top-0 z-40 h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 ">
      <slot name="top" />
    </div>
    <div class="px-4 py-4 pt-2 space-y-4">
      <!-- <UDashboardSidebarLinks :links="links" /> -->
      <UVerticalNavigation :links="links">
        <template #default="{ link }">

          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>

      </UVerticalNavigation>
      <SidebarAccordeonSubLink :items="settingsLink" :parent="parent" />
    </div>
  </div>
</template>
