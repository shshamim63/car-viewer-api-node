import { User } from './user.interface'

export interface AppResponse {
    data: string | User
    version: string
}
