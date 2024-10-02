import { NextFunction, Request, Response } from 'express'

import { AppError } from '../utils/appError'

import { RESPONSE_MESSAGE, STATUS_CODES } from '../const/error'
import { AUTHORIZED_USERS } from '../const'

export const hasAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req

    if (!AUTHORIZED_USERS.includes(user?.role))
        throw new AppError(
            STATUS_CODES.UNAUTHORIZED,
            RESPONSE_MESSAGE.UNAUTHORIZED
        )

    next()
}
