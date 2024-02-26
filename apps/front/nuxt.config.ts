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
  extends: ['@nuxt/ui-pro'],
  modules: ["nuxt-tiptap-editor", '@nuxt/ui', 'nuxt-auth-utils'],
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