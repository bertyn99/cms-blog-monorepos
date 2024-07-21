<template>
    <NodeViewWrapper class="w-full">
        <img :src="src" class="w-full dd" />
    </NodeViewWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps<{
    node: {
        attrs: {
            src: string;
        };
    };
}>();

const { uploadMedia, loading } = useMediaLibrary();
const src = ref<string | undefined>(props.node.attrs.src);

const uploadImage = async () => {
    if (props.node.attrs.src.startsWith('data:')) {
        const formData = new FormData();
        const base64 = props.node.attrs.src.split(',')[1];
        const file = atob(base64);

        formData.append(
            'file',
            new Blob([file], { type: 'image/png' }),
            'image.png'
        );

        try {
            const uploadedFile = await uploadMedia(formData);
            if (uploadedFile) {
                // Assuming the uploadedFile has a url property. Adjust if needed.
                src.value = uploadedFile.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // You might want to handle this error, perhaps by showing a toast notification
        }
    }
};

watch(() => props.node.attrs.src, uploadImage);

onMounted(uploadImage);
</script>