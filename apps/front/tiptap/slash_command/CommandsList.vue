<template>
    <node-view-wrapper>
        <UCommandPalette ref="commandPaletteRef" icon="i-lucide:blocks" :autoselect="false"
            @update:model-value="selectItem" :groups="[{ key: 'title', commands: items }]" :ui="ui">

            <template #title-icon="{
                item
            }">
                {{ item }}
                <UIcon :name="item" class="h-6 w-6" />
            </template>

            <template #title-command="{
                command
            }">
                <div>
                    <p class="font-medium">{{ command.label }}</p>
                    <p class="text-xs text-muted-foreground">{{ command.description }}</p>
                </div>

            </template>

        </UCommandPalette>
        <!--     <div v-for="item in items" @click="selectItem(item)"
            class="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-primary-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                <UIcon :icon="item.icon" class="h-full w-full" />
            </div>
            <div>
                <p className="font-medium">{{ item.title }}</p>
                <p className="text-xs text-muted-foreground">{{ item.description }}</p>
            </div>
        </div> -->


    </node-view-wrapper>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    items: Array,
    command: Function,
})
console.log(props.command)

const ui = {
    wrapper: 'rounded-md border border-muted flex flex-col flex-1 min-h-0 bg-gray-100 dark:bg-gray-900',
    container: 'relative flex-1 overflow-y-auto max-h-[200px] divide-y divide-gray-100 dark:divide-gray-800 scroll-py-2',
    input: {
        wrapper: 'relative flex items-center',
        base: 'w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none',
        padding: 'px-4',
        height: 'h-12',
        size: 'sm:text-sm',
        icon: {
            base: 'pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500',
            loading: 'animate-spin',
            size: 'h-5 w-5',
            padding: 'ps-11',
        },
        closeButton: {
            base: 'absolute end-4',
            padding: 'pe-10',
        },
    },
    emptyState: {
        wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
        label: 'text-sm text-center text-gray-900 dark:text-white',
        queryLabel: 'text-sm text-center text-gray-900 dark:text-white',
        icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4',
    },
    group: {
        wrapper: 'p-2',
        label: 'px-2.5 my-2 text-xs font-semibold text-gray-900 dark:text-white',
        container: 'text-sm text-gray-700 dark:text-gray-200 max-h-[100px] overflow-y-auto',
        command: {
            base: 'flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative',
            active: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
            inactive: '',
            label: 'flex items-center gap-1.5 min-w-0',
            prefix: 'text-gray-400 dark:text-gray-500',
            suffix: 'text-gray-400 dark:text-gray-500',
            container: 'flex items-center gap-1.5 min-w-0',
            icon: {
                base: 'flex-shrink-0 w-5 h-5',
                active: 'text-gray-900 dark:text-white',
                inactive: 'text-gray-400 dark:text-gray-500',
            },
            selectedIcon: {
                base: 'h-5 w-5 text-gray-900 dark:text-white flex-shrink-0',
            },
            avatar: {
                base: 'flex-shrink-0',
                size: '2xs',
            },
            chip: {
                base: 'flex-shrink-0 w-2 h-2 mx-1 rounded-full',
            },
            disabled: 'opacity-50',
            shortcuts: 'hidden md:inline-flex flex-shrink-0 gap-0.5',
        },
        active: 'flex-shrink-0 text-gray-500 dark:text-gray-400',
        inactive: 'flex-shrink-0 text-gray-500 dark:text-gray-400',
    },
    default: {
        icon: 'i-heroicons-magnifying-glass-20-solid',
        loadingIcon: 'i-heroicons-arrow-path-20-solid',
        emptyState: {
            icon: 'i-heroicons-magnifying-glass-20-solid',
            label: "We couldn't find any items.",
            queryLabel: "We couldn't find any items with that term. Please try again.",
        },
        closeButton: null,
        selectedIcon: 'i-heroicons-check-20-solid',
    },
}


const selectItem = item => {
    props.command(item)
}
const commandPaletteRef = ref()
const onKeyDown = ({ event }) => {
    console.log(event)
    if (event?.key === 'ArrowUp') {
        // Handle up arrow
        return true
    }

    if (event?.key === 'ArrowDown') {
        // Handle down arrow
        return true
    }

    if (event?.key === 'Enter') {
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