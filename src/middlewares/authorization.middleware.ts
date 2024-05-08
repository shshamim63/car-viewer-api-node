import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/appError'
import { AUTHORIZED_USERS } from '../const'

export const hasAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req

    if (!AUTHORIZED_USERS.includes(user?.role))
        throw new AppError(401, 'Unauthorized user')

    next()
}
