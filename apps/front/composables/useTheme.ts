import { useColorMode, useCycleList } from "@vueuse/core";

export const useTheme = () => {
  const optionsTheme = [
    { label: "Dark", icon: "i-heroicons-moon", mode: "dark" },
    { label: "Light", icon: "i-heroicons-sun", mode: "light" },
    { label: "System", icon: "i-heroicons-cog", mode: "auto" },
  ];

  //get the current color mode
  const mode = useColorMode({
    emitAuto: true,
    modes: {
      /* contrast: "dark contrast",
      cafe: "cafe", */
    },
  });

  //  function that loop through the list of optionsTheme to find the current theme
  const findCurrentThemeOptions = (theme: string) => {
    return optionsTheme.find((option) => option.mode === theme);
  };

  const selectedTheme = ref(
    findCurrentThemeOptions(mode.value) ?? optionsTheme[3]
  );

  watch(selectedTheme, () => {
    mode.value = selectedTheme.value.mode as any;
  });
  return {
    optionsTheme,
    mode,
    selectedTheme,
  };
};
