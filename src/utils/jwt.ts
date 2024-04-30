import jwt from 'jsonwebtoken'

import { AppError } from './appError'
import { TokenPayload, User } from '../interfaces/user.interface'

export const generateToken = (
    user: User,
    token: string,
    expiresIn: string = null
): string => {
    return jwt.sign(
        { ...user, id: user.id },
        token,
        expiresIn ? { expiresIn } : undefined
    )
}

export const verifyToken = (token: string, secret: string): TokenPayload => {
    try {
        const user = jwt.verify(token, secret)
        return user as TokenPayload
    } catch (error) {
        throw new AppError(401, 'Invalid authorization error')
    }
}
