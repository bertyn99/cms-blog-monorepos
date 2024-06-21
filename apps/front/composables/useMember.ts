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
        refreshNuxtData("admin-list-menbers");
      }
    } catch (error: any) {
      loading.value = false;
      console.error("Failed to change user role:", error);
      toast.add({
        id: `change-role-user-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Failed to change user role",
        description: error.message,
      });
    }
  };

  const updateMember = async (userData: FormData, id: string) => {
    try {
      /*  const headers = useRequestHeaders(["cookie"]); */
      const updatedUserData = await userRepo.updateMemberProfile(
        userData,
        id
        /*       headers */
      );

      if (updatedUserData) {
        toast.add({
          id: `update-user-${id}-success`,
          color: "green",
          icon: "i-heroicons-check-circle",
          title: "User updated",
          description: updatedUserData.msg,
        });
        refreshNuxtData("admin-list-menbers");
      }
    } catch (error: any) {
      console.error("Failed to update user data:", error);
      toast.add({
        id: `update-user-${id}-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Failed to update user",
        description: error.message,
      });
      /*       clearUser(); */
    }
  };

  const deleteUser = async (id: string) => {
    try {
      loading.value = true;
      const res = await userRepo.deleteUser(id);
      if (res) {
        loading.value = false;
        toast.add({
          id: `delete-users-${id}-success`,
          color: "green",
          icon: "i-heroicons-check-circle",
          title: "Users deleted",
          description: res.msg,
        });
        refreshNuxtData("admin-list-menbers");

        //remove member from members list
        /*  members.value = members.value.filter((member) => member.id !== id); */
      }
    } catch (error: any) {
      loading.value = false;
      console.error("Failed to delete users:", error);
      toast.add({
        id: `delete-users-${id}-error`,
        color: "red",
        icon: "i-heroicons-x-circle",
        title: "Failed to delete user",
        description: error.message,
      });
    }
  };

  return {
    members,
    fetchMembers,
    changeUsersRole,
    updateMember,
    deleteUser,
  };
};
