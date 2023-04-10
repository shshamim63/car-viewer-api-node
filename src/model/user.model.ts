import { z } from 'zod'
import {
    AuthenticatedUserSchema,
    LoginBodySchema,
    RefreshTokenSchema,
    RegistrationBodySchema,
    UserResponseSchema,
    UserSchema,
} from '../schema/user/user.schema'

export type IUser = z.infer<typeof UserSchema>
export type IRegistrationBody = z.infer<typeof RegistrationBodySchema>
export type IUserResponse = z.infer<typeof UserResponseSchema>
export type ILoginBody = z.infer<typeof LoginBodySchema>
export type IAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>
export type IRefreshToken = z.infer<typeof RefreshTokenSchema>
