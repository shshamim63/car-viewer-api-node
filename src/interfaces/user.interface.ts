import { z } from 'zod'
import { loginSchema, signupSchema } from '../validators/auth.validator'
import { Types } from 'mongoose'

export type LoginRequestBody = z.infer<typeof loginSchema>
export type SignupRequestBody = z.infer<typeof signupSchema>

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

interface UserData {
    avatar?: string
    email: string
    role: UserRole.Admin | UserRole.User | UserRole.Super
    status: UserStatus.Active | UserStatus.Inactive
    username: string
    createdAt: Date
    updatedAt: Date
}

export interface MongoUser extends UserData {
    _id: Types.ObjectId
    passwordHash: string
}

export interface User extends UserData {
    id: string
}

export interface AuthenticatedUser extends User {
    accessToken: string
    refreshToken: string
    type: 'Bearer'
}
