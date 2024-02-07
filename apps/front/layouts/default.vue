<script lang="ts" setup></script>

<template>
  <div class="h-screen">
    <SidebarPanel>
      <template #top>
        <div class="flex items-center space-x-2">
          <UIcon name="i-mdi:cube" />
          <span class="text-white">John Doe</span>
        </div>
      </template>
    </SidebarPanel>
    <slot />
  </div>
</template>

<style scoped></style>
