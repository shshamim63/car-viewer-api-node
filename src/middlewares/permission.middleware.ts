import { NextFunction, Response } from 'express'
import { AppError } from '../utils/appError'
import { verifyToken } from '../utils/jwt'
import { authConfig } from '../config'
import { CustomRequest } from '../types/express'

export const authenticate = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null)
        throw new AppError(401, 'Invalid user credential', `Invalid password`)
    const user = verifyToken(token, authConfig.accessTokenSecret)

    req.user = user
    next()
}

export const authorized = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (!['super', 'admin'].includes(user?.role))
        throw new AppError(401, 'Unauthorized user')

    next()
}
