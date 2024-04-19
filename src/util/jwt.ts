import jwt from 'jsonwebtoken'

import { AppError } from './appError'

export const generateToken = (
    user: any,
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

export const verifyToken = (token: string, secret: string): any => {
    try {
        const user = jwt.verify(token, secret)
        return user as any
    } catch (error) {
        throw new AppError(401, 'Invalid authorization error')
    }
}
