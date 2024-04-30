import { ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'

import { AppError } from '../utils/appError'

export const bodyValidation =
    (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const content = req.body
            const parseData = await schema.parseAsync(content)
            req.body = parseData
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

export const headersValidation =
    (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const content = req.headers
            await schema.parseAsync(content)
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

export const queryValidation =
    (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const content = req.query
            const parseData = await schema.parseAsync(content)
            req.query = parseData
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
