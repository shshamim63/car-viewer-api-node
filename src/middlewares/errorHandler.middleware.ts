import { Request, Response } from 'express'

interface CustomError extends Error {
    statusCode: number
    description?: string
}

export const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response
) => {
    const errorResponse = {
        message: err.message ? err.message : 'Server Error',
        ...(err.description && { description: err.description }),
    }
    const statusCode = err.statusCode ? err.statusCode : 500

    res.status(statusCode).send(errorResponse)
}
