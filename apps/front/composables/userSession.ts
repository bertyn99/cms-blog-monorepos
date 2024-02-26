// composables/useUserSession.js
import { computed } from 'vue';

import { User } from '~/types'; // Adjust the import path based on where you define your User type

export const useUserSession = () => {
    // The state is initially null and will be a User object when logged in
    const userState = useState<User | null>('user', () => null);

    const setUser = (userData: User) => {
        userState.value = userData;
    };

    const clearUser = () => {
        userState.value = null;
    };

    const fetchAndSetUser = async () => {
        try {
            const userData = await userRepository.fetchUserData();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            clearUser();
        }
    };

    // Computed property to check if the user is logged in
    const loggedIn = computed(() => userState.value !== null);

    // Ensure user is a ComputedRef<User | null> for reactivity and type safety
    const user = computed(() => userState.value);

    return {
        loggedIn,
        user,
        setUser,
        clearUser,
        fetchAndSetUser,
    };
};
