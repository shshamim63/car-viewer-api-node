import { ZodSchema } from 'zod'
import { AppError } from '../util/appError'

export const schemaValidation = <T>(schema: ZodSchema, body: T): T => {
    try {
        return schema.parse(body)
    } catch (error) {
        throw new AppError(400, 'Invalid Schema', error.errors)
    }
}
