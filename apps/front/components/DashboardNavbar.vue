<template>
    <div
        class="sticky top-0 z-40 h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4">
        <div class="flex items-center justify-between flex-1 gap-x-1.5">
            <UBreadcrumb :links="breadcrumbs" />


            <div class="flex items-center gap-x-4 min-w-8">

                <slot name="right">

                </slot>

            </div>

        </div>
    </div>
</template>

<script setup>
const { breadcrumbs } = useBreadcrumbs()

watch(() => breadcrumbs, () => {
    console.log(breadcrumbs)
})
</script>