<template>
    <node-view-wrapper>
        <div class="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
            <div class="max-h-64 overflow-y-auto">
                <button v-for="item in props.items" :key="item.title" @click="selectItem(item)"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-200 ease-in-out">
                    {{ item.title }}
                </button>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    items: Array,
    command: Function,
})

const selectItem = item => {
    props.command(item)
}

const onKeyDown = ({ event }) => {
    if (event.key === 'ArrowUp') {
        // Handle up arrow
        return true
    }

    if (event.key === 'ArrowDown') {
        // Handle down arrow
        return true
    }

    if (event.key === 'Enter') {
        // Handle enter
        return true
    }

    return false
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
})

defineExpose({ onKeyDown })
</script>