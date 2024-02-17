import vine from '@vinejs/vine'

export const authValidator = vine.compile(
    vine.object({
        fullName: vine.string().trim(),
        email: vine.string().email(),
        password: vine.string().minLength(6).confirmed(),
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(6),
    })
)