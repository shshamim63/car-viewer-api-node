import { ZodSchema } from 'zod'
import { AppError } from '../middlewares/appError'

export const schemaValidation = (schema: ZodSchema, body: any) => {
    try {
        return schema.parse(body)
    } catch (error) {
        throw new AppError(400, 'Invalid Schema', error.errors)
    }
}
