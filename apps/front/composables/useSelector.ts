export const useSelector = (data: Ref<any[]>) => {
  const dataArrWithSelector = ref(
    data.value.map((item) => ({ ...item, isSelected: false }))
  );

  const selectedElement = computed(() =>
    dataArrWithSelector.value.filter((f) => f.isSelected)
  );

  watch(
    data,
    (newVal) => {
      dataArrWithSelector.value = newVal.map((item) => ({
        ...item,
        isSelected: false,
      }));
    },
    { deep: true }
  );
  watch(selectedElement, (newVal) => {
    console.log("chnged Select");
  });
  return {
    dataArrWithSelector,
    selectedElement,
  };
};
