<template>
    <Disclosure v-slot="{ open }" :default-open="parent.defaultOpen === undefined ? false : parent.defaultOpen" as="div"
        class="w-full items-center">
        <DisclosureButton as="template">
            <div class="flex cursor-pointer items-center gap-1.5 px-2.5">
                <UIcon name="i-material-symbols-settings-outline "
                    class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                <span class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white "> {{
        parent.label
    }}</span>

                <UIcon
                    :name="!open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down' ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'"
                    class="w-4 h-4 ml-auto" />
            </div>


        </DisclosureButton>

        <Transition v-bind="transition" @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave"
            @leave="onLeave">
            <DisclosurePanel class="text-gray-500 px-3 mt-2" v-if="items?.length && open">
                <UVerticalNavigation :links="items">
                    <template #icon="{ link }">
                        <UChip :ui="{
        base: 'mx-1.5',
        background: 'bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-200',
    }">
                            <span
                                class="w-2 h-full  bg-gray-100 dark:bg-gray-700 relative after:absolute after:z-[1] after:w-px after:h-full after:bg-gray-200 after:dark:bg-gray-700 after:transform after:translate-y-full after:inset-x-0">

                            </span>
                        </UChip>
                    </template>
                </UVerticalNavigation>
            </DisclosurePanel>
        </Transition>
    </Disclosure>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { VerticalNavigationLink } from "#ui/types"
import { Disclosure, DisclosureButton, DisclosurePanel, provideUseId } from '@headlessui/vue'
import { useId } from '#imports'
import type { _background } from '#tailwind-config/theme/accentColor';

defineOptions({
    inheritAttrs: true,
})
type AccordeonSubLinkParentProps = {
    label: string
    defaultOpen?: boolean
}

provideUseId(() => useId())
defineProps({
    items: {
        type: Array as PropType<VerticalNavigationLink[]>,
        default: () => []
    },
    level: {
        type: Number,
        default: 0
    },
    parent: {
        type: Object as PropType<AccordeonSubLinkParentProps>,
        default: () => ({
            label: '',
            defaultOpen: false
        })
    }
});

const transition = {
    enterActiveClass: 'overflow-hidden transition-[height] duration-200 ease-out',
    leaveActiveClass: 'overflow-hidden transition-[height] duration-200 ease-out'
}


function onEnter(_el: Element, done: () => void) {
    const el = _el as HTMLElement
    el.style.height = '0'
    el.offsetHeight // Trigger a reflow, flushing the CSS changes
    el.style.height = el.scrollHeight + 'px'

    el.addEventListener('transitionend', done, { once: true })
}

function onBeforeLeave(_el: Element) {
    const el = _el as HTMLElement
    el.style.height = el.scrollHeight + 'px'
    el.offsetHeight // Trigger a reflow, flushing the CSS changes
}

function onAfterEnter(_el: Element) {
    const el = _el as HTMLElement
    el.style.height = 'auto'
}

function onLeave(_el: Element, done: () => void) {
    const el = _el as HTMLElement
    el.style.height = '0'

    el.addEventListener('transitionend', done, { once: true })
}
</script>
