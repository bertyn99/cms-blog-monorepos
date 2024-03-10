

export const useSelector = (data:any) => {


    const dataArrWithSelector = ref(data.map((item:any) => {
        return {
            ...item,
            isSelected: false
        }
    }))

    const selectedElement = computed(() => dataArrWithSelector.value.filter(f => f.isSelected))





    return {
        dataArrWithSelector,
        selectedElement
    }

}