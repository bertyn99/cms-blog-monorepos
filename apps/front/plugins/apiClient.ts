export default defineNuxtPlugin({
  setup() {
    const config = useRuntimeConfig();

    const api = $fetch.create({
      baseURL: config.public.api,
    });
    return {
      provide: {
        api,
      },
    };
  },
});
