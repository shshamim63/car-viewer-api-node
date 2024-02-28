import { Request, Response, NextFunction } from 'express'

export const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorResponse = {
        message: err.message ? err.message : 'Server Error',
        ...(err.description && { description: err.description }),
    }
    const statusCode = err.statusCode ? err.statusCode : 500

    res.status(statusCode).send(errorResponse)
}
