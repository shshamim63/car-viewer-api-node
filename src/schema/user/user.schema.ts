import { z } from 'zod'

const email = z.string().email()
const username = z.string().min(6)

export const LoginBodySchema = z.object({
    email: email,
    password: z.string().min(8),
})

export const RegistrationBodySchema = LoginBodySchema.merge(
    z.object({
        username: username,
        confirmPassword: z.string().min(8),
        avatar: z.string().optional(),
    })
).refine((val) => val.password === val.confirmPassword, {
    message: 'Password and confirm password must match',
})

export const UserResponseSchema = z.object({
    avatar: z.string().optional(),
    createdAt: z.date(),
    email: email,
    _id: z.string(),
    profileId: z.string().nullable().optional(),
    updatedAt: z.date(),
    username: username,
})

export const UserSchema = UserResponseSchema.merge(
    z.object({
        passwordHash: z.string(),
    })
)

export const AuthenticatedUserSchema = UserResponseSchema.merge(
    z.object({
        accessToken: z.string(),
        refreshToken: z.string()
    })
)
