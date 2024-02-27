import jwt from 'jsonwebtoken'

import { IUser } from '../model/user/user.model'
import { AppError } from './appError'

export const generateToken = (
    user: IUser,
    token: string,
    expiresIn: string = null
): string => {
    if (expiresIn) {
        return jwt.sign({ ...user, id: user.id }, token, {
            expiresIn: expiresIn,
        })
    } else {
        return jwt.sign({ ...user, id: user.id }, token)
    }
}

export const verifyToken = (token: string, secret: string): IUser => {
    try {
        const user = jwt.verify(token, secret)
        return user as IUser
    } catch (error) {
        throw new AppError(401, 'Invalid authorization error')
    }
}
