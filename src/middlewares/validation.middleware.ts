import { ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'

import { AppError } from '../util/appError'

export const validation =
    (schema: ZodSchema, accessor = 'body') =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let content

            if (accessor === 'body') content = req.body
            if (accessor === 'headers') content = req.headers
            if (accessor === 'path') content = req.query

            const parseData = await schema.parseAsync(content)

            if (accessor === 'body') req.body = parseData
            if (accessor === 'headers') req.headers = parseData
            if (accessor === 'path') req.query = parseData
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
