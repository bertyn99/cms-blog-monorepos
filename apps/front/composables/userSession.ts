// composables/useUserSession.js
import { computed } from "vue";
import type { User } from "~/types/auth-form";
import type { Role } from "@yggdra/shared";

export const useUserSession = () => {
  const { $api } = useNuxtApp();
  const userRepo = userRepository($api);
  // The state is initially null and will be a User object when logged in
  const userState = useState<User | null>("user", () => null);

  // Computed property to check if the user is logged in
  const loggedIn = computed(() => userState.value !== null);

  const isAdmin = computed(
    () => userState.value!.role === ("Admin" as Role.ADMIN)
  );

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
      const headers = useRequestHeaders(["cookie"]);
      const userData = await userRepo.fetchUserProfile(headers);

      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      clearUser();
    }
  };

  const updateUser = async (userData: User) => {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const updatedUserData = await userRepo.updateUserProfile(
        userData,
        headers
      );

      setUser(updatedUserData);
    } catch (error) {
      console.error("Failed to update user data:", error);
      /*       clearUser(); */
    }
  };

  return {
    loggedIn,
    user,
    setUser,
    clearUser,
    fetchAndSetUser,
    updateUser,
  };
};
