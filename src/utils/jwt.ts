import jwt from 'jsonwebtoken'

import { AppError } from './appError'
import { RESPONSE_MESSAGE, STATUS_CODES } from '../const/error'

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
        switch (error.name) {
            case 'JsonWebTokenError':
                throw new AppError(
                    STATUS_CODES.UNAUTHORIZED,
                    RESPONSE_MESSAGE.UNAUTHORIZED,
                    error.message
                )
            case 'TokenExpiredError':
                throw new AppError(
                    STATUS_CODES.UNAUTHORIZED,
                    RESPONSE_MESSAGE.UNAUTHORIZED,
                    error.message
                )
            default:
                throw new AppError(
                    STATUS_CODES.INTERNAL_SERVER_ERROR,
                    RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
                )
        }
    }
}
