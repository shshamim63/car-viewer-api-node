import { z } from 'zod'
import { RegistrationBodySchema, UserResponseSchema, UserSchema } from '../schema/user/user.schema';

export type IUser = z.infer<typeof UserSchema>;
export type IRegistrationBody = z.infer<typeof RegistrationBodySchema>
export type IUserResponse = z.infer<typeof UserResponseSchema>