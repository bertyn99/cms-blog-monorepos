export default defineNuxtPlugin(({ app }) => {
    const config = useRuntimeConfig();
    console.log(config.public);
    return {
        provide: {
            api: (path: string) => config.public.api + path
        }
    }
})