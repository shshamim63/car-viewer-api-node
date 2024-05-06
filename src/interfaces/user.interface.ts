import { z } from 'zod'
import { Types } from 'mongoose'

import {
    activateAccountQuerySchema,
    loginSchema,
    signupSchema,
} from '../validators/auth.validator'

export type LoginRequestBody = z.infer<typeof loginSchema>
export type SignupRequestBody = z.infer<typeof signupSchema>
export type ActivateAccountQuery = z.infer<typeof activateAccountQuerySchema>

export interface NewUser {
    email: string
    passwordHash: string
    avatar: string
    username: string
}

export const ACTIVESTATUS = ['Inactive', 'Active'] as const
export const ROLE = ['user', 'admin', 'super'] as const

export enum UserRole {
    User = 'user',
    Admin = 'admin',
    Super = 'super',
}

export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export interface UserUpdateAbleFields {
    avatar?: string
    role: UserRole.Admin | UserRole.User | UserRole.Super
    status: UserStatus.Active | UserStatus.Inactive
}

interface MongoTimeStamp {
    createdAt: Date
    updatedAt: Date
}

interface UserData extends UserUpdateAbleFields, MongoTimeStamp {
    email: string
    username: string
}

export interface MongoUser extends UserData {
    _id: Types.ObjectId
    passwordHash: string
}

export interface User extends UserData {
    id: string
}

export interface TokenPayload extends User {
    iat: number
    exp: number
}

export interface AuthenticatedUser extends User {
    accessToken: string
    refreshToken: string
    type: 'Bearer'
}

export interface MongoRefreshToken extends MongoTimeStamp {
    _id: Types.ObjectId
    userId: Types.ObjectId
    token: string
}
