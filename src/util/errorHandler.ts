import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
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

    res.send(errorResponse).status(statusCode)
}
