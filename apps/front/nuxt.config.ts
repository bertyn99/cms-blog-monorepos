// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  runtimeConfig: {
    public: {
      api: process.env.NUXT_PUBLIC_API_URL
    }
  },
  vue: {
    propsDestructure: true
  },
  extends: ['@nuxt/ui-pro'],
  modules: ["nuxt-tiptap-editor", '@nuxt/ui'],
  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },
  imports: {
    dirs: [
      './repositories',
    ]
  },
  ui: {

    icons: {},
  }
})