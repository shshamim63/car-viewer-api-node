import { Request } from 'express'
import { IUser } from '../../model/user/user.model'

export interface CustomRequest extends Request {
    user?: IUser
}
