import type { Post } from "@yggdra/shared";

type Locale = {
    label: string,
    locale: string,
    exist?: boolean
}
export const useLocale = async (idPost?: number) => {
    const { $api } = useNuxtApp();
    const postRepo = postRepository($api);
    const localTranslationState: Locale[] = [
        {
            label: 'French(FR)',
            locale: 'fr',
            exist: false
        },
        {
            label: 'English(EN)',
            locale: 'en', exist: false
        },
        {
            label: 'Spanish(ES)',
            locale: 'es ',
            exist: false
        },
        {
            label: 'Italian(IT)',
            locale: 'it',
            exist: false
        },

    ]

    const selectedLocale = ref(localTranslationState[0])


    const setSelectedLocale = (locale: any) => {
        const foundLocale = localTranslationState.find((lang) => lang.locale === locale);
        if (foundLocale) {
            selectedLocale.value = foundLocale;
        }
    }
    const posts = ref<Post[] | null>(null)
    const getPost = async () => {
        const response = await postRepo.getPost(Number(idPost))
        posts.value = response.translations
    }




    if (idPost) {
        await getPost();
        if (posts.value) {
            posts.value.forEach((post) => {
                const l = localTranslationState.find((locale) => locale.locale === post.locale)
                //check if post.locale is not null and if it match a locale in the localTranslationState array
                if (post.locale && l) {
                    //if it does, set the exist property to true on the localTranslationState array
                    l.exist = true
                } else {
                    if (l) l.exist = false
                }
            })
        }
    }
    return {
        selectedLocale,
        setSelectedLocale,
        localTranslationState
    };
}