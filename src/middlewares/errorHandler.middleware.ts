import { Request, Response, NextFunction } from 'express'

export const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorResponse = {
        message: 'Server Error',
    }
    let statusCode = 500

    if (err.message) errorResponse['message'] = err.message
    if (err.description) errorResponse['description'] = err.description
    if (err.statusCode) statusCode = err.statusCode

    res.status(statusCode).send(errorResponse)
}
