import { createSharedComposable } from "@vueuse/core";

const _useDashboard = () => {
  const route = useRoute();
  const router = useRouter();
  /*   const isHelpSlideoverOpen = ref(false);
  const isNotificationsSlideoverOpen = ref(false);
 */
  defineShortcuts({
    "g-h": () => router.push("/"),
    "g-i": () => router.push("/inbox"),
    "g-c": () => router.push("/calendar"),
    "g-p": () => router.push("/pages"),
    "g-a": () => router.push("/posts"),
    "g-u": () => router.push("/users"),
    "g-s": () => router.push("/settings"),
    /*     "?": () => (isHelpSlideoverOpen.value = true),
    n: () => (isNotificationsSlideoverOpen.value = true), */
  });

  watch(
    () => route.fullPath,
    () => {}
  );
};

export const useDashboard = createSharedComposable(_useDashboard);
