

export const useSelector = (data: Ref<any[]>) => {

    const dataArrWithSelector = computed(() => data.value.map((item) => ({ ...item, isSelected: false })));

    const selectedElement = computed(() => dataArrWithSelector.value.filter(f => f.isSelected))

    return {
        dataArrWithSelector,
        selectedElement
    }

}