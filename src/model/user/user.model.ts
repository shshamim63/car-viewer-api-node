import { z } from 'zod'
import {
    ActivateUserQuerySchema,
    AuthenticatedUserSchema,
    LoginBodySchema,
    RefreshTokenSchema,
    RegistrationBodySchema,
    UserResponseSchema,
    UserSchema,
    ZodActiveStatusEnum,
    ZodRoleEnum,
} from './user.schema'

export type IActivateUserQuery = z.infer<typeof ActivateUserQuerySchema>
export type IUser = z.infer<typeof UserSchema>
export type IRegistrationBody = z.infer<typeof RegistrationBodySchema>
export type IUserResponse = z.infer<typeof UserResponseSchema>
export type ILoginBody = z.infer<typeof LoginBodySchema>
export type IAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>
export type IRefreshToken = z.infer<typeof RefreshTokenSchema>
export type ActivateStatusEnum = z.infer<typeof ZodActiveStatusEnum>
export type RoleEnum = z.infer<typeof ZodRoleEnum>
