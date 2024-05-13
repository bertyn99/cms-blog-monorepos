<script setup lang="ts">
const model = defineModel({
    type: Boolean
})

const toast = useToast()

const loading = ref(false)

function onDelete() {
    loading.value = true

    setTimeout(() => {
        loading.value = false
        toast.add({ icon: 'i-heroicons-check-circle', title: 'Your account has been deleted', color: 'red' })
        model.value = false
    }, 2000)
}
</script>

<template>

</template>