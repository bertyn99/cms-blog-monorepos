import { computed } from "vue";
import type { User } from "~/types/auth-form";
import type { Role } from "@yggdra/shared";

export const useMember = () => {
  const { $api } = useNuxtApp();
  const userRepo = userRepository($api);
  const loading = ref(false);
  const members = ref<User[]>([]);
  const toast = useToast();

  const fetchMembers = async () => {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const membersData = await userRepo.getUsers(headers);
      members.value = membersData;
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const changeUsersRole = async (ids: string[], role: string) => {
    try {
      loading.value = true;
      /*  const headers = useRequestHeaders(["cookie"]); */
      const res = await userRepo.updateUsersRoles(ids, role);
      if (res) {
        loading.value = false;
        toast.add({
          id: `change-role-user-success`,
          color: "green",
          icon: "i-heroicons-check-circle",
          title: "User role changed",
          description: res.msg,
        });
        clearNuxtData("admin-list-menbers");
      }
    } catch (error) {
      console.error("Failed to change user role:", error);
    }
  };

  return {
    members,
    fetchMembers,
    changeUsersRole,
  };
};
