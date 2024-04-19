import { z } from 'zod'
import { loginSchema, signupSchema } from '../validators/auth.validator'

export type LoginRequestBody = z.infer<typeof loginSchema>
export type SignupRequestBody = z.infer<typeof signupSchema>

export interface NewUser {
    email: string
    passwordHash: string
    avatar: string
    username: string
}
