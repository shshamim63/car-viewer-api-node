import { z } from 'zod'

const emailSchema = z.string({ required_error: 'Email must exist' }).email()
const passwordScchema = z.string().min(8)

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordScchema,
})

export const signupSchema = loginSchema
    .extend({
        avatar: z.string().optional().default(''),
        email: emailSchema,
        username: z.string().min(5),
        confirmPassword: passwordScchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
    })

export const refreshTokenSchema = z.object({
    refresh_token: z.string(),
})

export const activateAccountQuerySchema = z.object({
    token: z.string(),
})
