export default defineNuxtPlugin({
    setup() {
        const config = useRuntimeConfig();
        console.log(config.public.api);
        const api = $fetch.create({
            baseURL: config.public.api
        });
        return {
            provide: {
                api
            }
        }
    }

})