import { NextFunction, Request, Response } from 'express'

import { AppError } from '../utils/appError'
import { RESPONSE_MESSAGE, STATUS_CODES } from '../const/error'

import { verifyToken } from '../utils/jwt'
import { authConfig } from '../config'

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1]

    if (token == null)
        throw new AppError(
            STATUS_CODES.UNAUTHORIZED,
            RESPONSE_MESSAGE.UNAUTHORIZED
        )

    const user = verifyToken(token, authConfig.accessTokenSecret)
    req.user = user
    next()
}
