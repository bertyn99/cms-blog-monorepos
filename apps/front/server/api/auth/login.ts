

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);
    const runtimeConfig = useRuntimeConfig();

    console.log('Server-side', runtimeConfig.public.api)
    if (!email || !password) return new Response('Email and password are required', { status: 400 });
    try {
        const userClient = await $fetch<any>(`${runtimeConfig.public.api}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            },
            )
        });
        console.log('Server-side', userClient)

        if (userClient.error) {
            throw Error(userClient.error);
        }


        const getUser = await $fetch<any>(`${runtimeConfig.public.api}/users/me`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('Server-side', getUser)


        /*     await setUserSession(event,); */
    } catch (error) {
        console.error(error);
        throw createError({
            message: "Authorization Failed",
            statusCode: 401,
        });
    }

    return new Response('Logged in', { status: 200 });
})