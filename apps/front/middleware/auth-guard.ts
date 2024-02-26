export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value) {
        // If user is not loggedIn, redirect to login page
        return navigateTo('/')
    }

    // User is authenticated, proceed as normal
})