import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/appError'
import { verifyToken } from '../utils/jwt'
import { authConfig } from '../config'

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1]
    if (token == null) throw new AppError(401, 'Unauthorized user')
    const user = verifyToken(token, authConfig.accessTokenSecret)
    req.user = user
    next()
}
