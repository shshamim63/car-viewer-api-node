import { NextFunction, Response, Request } from 'express'

export const invalidRouteMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next({ statusCode: 500, message: 'Invalid URL' })
}
