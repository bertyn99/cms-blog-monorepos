import { computed } from "vue";
import type { User } from "~/types/auth-form";
import type { Role } from "@yggdra/shared";

export const useProfile = () => {
  const { $api } = useNuxtApp();
  const userRepo = userRepository($api);

  const updateUser = async (userData: FormData) => {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const updatedUserData = await userRepo.updateUserProfile(
        userData,
        headers
      );
      if (!updatedUserData) {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
      /*       clearUser(); */
    }
  };

  return {
    updateUser,
  };
};
