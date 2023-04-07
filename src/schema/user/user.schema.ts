import { z } from 'zod'

const email = z.string().email()
const username = z.string().min(6)

export const RegistrationBodySchema = z.object({
    email: email,
    username: username,
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    avatar: z.string().optional()
}).refine((val) => val.password === val.confirmPassword, {
    message: 'Password and confirm password must match'
})

export const UserResponseSchema = z.object({
    email: email,
    username: username,
    profileId: z.string().optional(),
    avatar: z.string().optional()
})

export const UserSchema = UserResponseSchema.merge(z.object({
    passwordHash: z.string()
}))