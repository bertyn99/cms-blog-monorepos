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
  modules: ['@nuxt/ui'],
  ui: {

    icons: {},
  }
})