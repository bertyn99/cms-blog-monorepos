import type { Post } from "@yggdra/shared";

export const useLocale = async (idPost?: number) => {
    const { $api } = useNuxtApp();
    const postRepo = postRepository($api);
    const lang = [
        {
            label: 'French(FR)',
            locale: 'fr'
        },
        {
            label: 'English(EN)',
            locale: 'en'
        },
        {
            label: 'Spanish(ES)',
            locale: 'es '
        },
        {
            label: 'Italian(IT)',
            locale: 'it'
        },

    ]
    //loop through the translations and get the one that matches the selected locale
    const localTranslationState: any[] = lang.map((locale) => ({ ...locale, exist: false }));

    const selectedLocale = ref(localTranslationState[0])
    console.log(localTranslationState)

    const setSelectedLocale = (locale: any) => {
        const foundLocale = lang.find((lang) => lang.locale === locale);
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
                    l.exist = false
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