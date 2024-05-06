import { NextFunction, Response, Request } from 'express'
import { AppError } from '../utils/appError'

export const invalidRouteMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const invalidRouteError = new AppError(500, 'Invalid URL')
    next(invalidRouteError)
}
