import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/appError'

export const validation =
    (schema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req
            const parseBody = await schema.parseAsync(body)
            req.body = parseBody
            next()
        } catch (error) {
            const invalidSchemaError = new AppError(
                400,
                'Invalid Schema',
                error.errors
            )
            next(invalidSchemaError)
        }
    }
