import vine from '@vinejs/vine'

export const seoMetaValidator = vine.object({
    metaTitle: vine.string().nullable(),
    metaDescription: vine.string().nullable(),
    metaKeywords: vine.string().nullable(),
    structuredData: vine.any().nullable(),
})


export const newPostTranslationValidator = vine.compile(
    vine.object({
        postId: vine.number().nullable().optional(),
        locale: vine.string().trim(),
        title: vine.string().trim(),
        content: vine.string(),
        description: vine.string().nullable(),
        slug: vine.string().nullable(),
        seo: vine.object({
            ...seoMetaValidator.getProperties(),
        }).nullable(),
    })
)



