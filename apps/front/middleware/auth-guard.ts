export default defineNuxtRouteMiddleware(async () => {
    const { loggedIn, fetchAndSetUser, user } = useUserSession();


    if (user.value === null) {
        //try to fetch user data
        await fetchAndSetUser();
        // If user is still not loggedIn, redirect to login page
        if (!loggedIn.value)
            return navigateTo('/admin/login')


    }

    // User is authenticated, proceed as normal
})