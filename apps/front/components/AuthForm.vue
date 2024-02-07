<script lang="ts" setup>
import type { PropType } from "vue";
import type { fieldType } from "@/types";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  fields: {
    type: Array as PropType<fieldType>,
    default: () => [
      { label: "Email", type: "email", placeholder: "Enter your email" },
      {
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
      },
    ],
  },
  align: {
    type: String as PropType<"bottomn" | "top">,
    default: "center",
  },
  submitButton: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "i-heroicons-lock-closed",
  },
  wrapper: {
    type: String,
    default: "w-full max-w-sm space-y-6",
  },
  providers: {
    type: Array as PropType<
      {
        label: string;
        icon: string;
        color: string;
        click: () => void;
      }[]
    >,
    default: () => [],
  },
});
//generate a reactive state object that adapts with the fields
const state = reactive(
  props.fields.reduce(
    (acc, field: any) => {
      acc[field.label] = "";
      return acc;
    },
    {} as Record<string, string>
  )
);

const hasMultipleProviders = computed(() => props.providers.length > 1);
</script>

<template>
  <div :class="wrapper">
    <UIcon
      :name="icon"
      class="w-16 h-16 mx-auto text-primary-500 dark:text-primary-400"
    />
    <h2 class="text-2xl text-gray-900 dark:text-white font-bold">
      {{ title }}
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mt-1">
      <slot name="description">{{ description }}</slot>
    </p>
    <UContainer :align="align" class="mx-0 px-0 gap-y-6 flex flex-col">
      <div v-if="providers.length" class="flex space-x-2">
        <template v-for="provider in providers" :key="provider.label">
          <UButton
            :color="provider.color"
            :icon="provider.icon"
            dynamic
            :trailing="false"
            :click="provider.click"
            :label="provider.label"
            :block="!hasMultipleProviders"
          />
        </template>
      </div>
      <UDivider label="OR" />
      <UForm :state="state" class="space-y-6">
        <UFormGroup
          v-for="field in fields"
          :key="field.label"
          :label="field.label"
          :name="field.label"
        >
          <UInput
            v-model="state[field.label]"
            :placeholder="field.placeholder"
            :type="field.type"
          />
        </UFormGroup>

        <UButton type="submit" :disabled="loading" block>{{
          submitButton ?? "Submit"
        }}</UButton>
      </UForm>
    </UContainer>
  </div>
</template>

<style scoped></style>
