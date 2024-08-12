<script lang="ts" setup>
import type { PropType } from "vue";

const { links } = defineProps({
  links: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

const { loggedIn, user } = useUserSession()

console.log('user', user)
const settingsLink = computed(() => user.value?.roleAccess == "admin" ? [
  {
    label: "General",
    to: "/admin/settings",
  },
  {
    label: "Members",
    to: "/admin/settings/menbers",
  },

] : [
  {
    label: "General",
    to: "/admin/settings",
  },

])


const { metaSymbol } = useShortcuts()

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

    <div class="flex flex-col w-full flex-1 relative overflow-hidden">
      <div class="flex-grow flex flex-col min-h-0 gap-y-2 py-2">
        <div class="w-full flex flex-col px-4">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
            placeholder="Search...">
            <template #trailing>
              <div class="flex items-center gap-0.5">
                <UKbd>{{ metaSymbol }}</UKbd>
                <UKbd>K</UKbd>
              </div>
            </template>
          </UInput>
        </div>
        <div class="flex-1 px-4 flex flex-col gap-y-2 overflow-y-auto">
          <!-- <UDashboardSidebarLinks :links="links" /> -->
          <UVerticalNavigation :links="links">
            <template #default="{ link }">
              <span class="group-hover:text-primary relative">{{ link.label }}</span>
            </template>
          </UVerticalNavigation>
          <SidebarAccordeonSubLink :items="settingsLink" :parent="parent" />

        </div>
        <div class="flex items-center justify-between gap-x-1.5 flex-shrink-0 px-4">
          <SidebarUserDropdown />
        </div>
      </div>
    </div>
  </div>
</template>
