// composables/useUserSession.js
import { computed } from 'vue';
import type { User } from '~/types/auth-form';

// Adjust the import path based on where you define your User type

export const useUserSession = () => {
    const { $api } = useNuxtApp();
    const userRepo = userRepository($api);
    // The state is initially null and will be a User object when logged in
    const userState = useState<User | null>('user', () => null);

    // Computed property to check if the user is logged in
    const loggedIn = computed(() => userState.value !== null);

    // Ensure user is a ComputedRef<User | null> for reactivity and type safety
    const user = computed(() => userState.value);

    const setUser = (userData: User) => {
        userState.value = userData;
    };

    const clearUser = () => {
        userState.value = null;
    };

    const fetchAndSetUser = async () => {
        try {
            const headers = useRequestHeaders(['cookie'])
            const userData = await userRepo.fetchUserProfile(headers);

            setUser(userData);


        } catch (error) {
            console.error('Failed to fetch user data:', error);
            clearUser();
        }
    };



    return {
        loggedIn,
        user,
        setUser,
        clearUser,
        fetchAndSetUser,
    };
};
