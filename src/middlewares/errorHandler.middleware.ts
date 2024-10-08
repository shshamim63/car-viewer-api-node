import { NextFunction, Request, Response } from 'express'

import { ErrorProperty } from '../model/utils/error'
import { logger } from '../utils/logger'

import { RESPONSE_MESSAGE } from '../const/error'

interface CustomError extends Error {
    statusCode: number
    description?: string | ErrorProperty
}

export const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorResponse = {
        message: err.message
            ? err.message
            : RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
        ...(err.description && { description: err.description }),
    }
    const statusCode = err.statusCode ? err.statusCode : 500
    logger.error(err.message)
    res.status(statusCode).send(errorResponse)
}
