import { computed } from "vue";
import type { User } from "~/types/auth-form";
import type { Role } from "@yggdra/shared";

export const useMember = () => {
  const { $api } = useNuxtApp();
  const userRepo = userRepository($api);

  const members = ref<User[]>([]);

  const fetchMembers = async () => {
    try {
      const membersData = await userRepo.getUsers();
      members.value = membersData;
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  return {
    members,
    fetchMembers,
  };
};
