// composables/useUserSession.js
import { computed } from "vue";
import type { User } from "~/types/auth-form";
import type { Role } from "@yggdra/shared";

export const useUserSession = () => {
  const { $api } = useNuxtApp();
  const router = useRouter();
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

  const clearUser = async () => {
    const headers = useRequestHeaders(["cookie"]);
    // Clear the user data from the cookie
    const userData = await userRepo.logout(headers);

    userState.value = null;

    //redirect to login page
    router.push("/admin/login");

    /*  const cookie = useCookie("adonis-session");
    console.log("Cookie before clear:", cookie.value);
    cookie.value = null;
    console.log("Cookie after clear:", cookie.value); */
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
      if (!updatedUserData) {
        throw new Error("Failed to update user data");
      }
      setUser(updatedUserData as User);
    } catch (error) {
      console.error("Failed to update user data:", error);
      /*       clearUser(); */
    }
  };

  watch(user, (newUser) => {});
  return {
    loggedIn,
    user,
    setUser,
    clearUser,
    fetchAndSetUser,
    updateUser,
  };
};
