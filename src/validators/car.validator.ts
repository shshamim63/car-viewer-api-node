import { z } from 'zod'
import { MongoDBObjectIdSchema } from './common.validator'

export const CarRequestBodySchema = z.object({
    manufacturing_year: z.string(),
    images: z.string().array().optional(),
    type: z.string(),
    brandId: MongoDBObjectIdSchema.optional(),
})

export const CarSchema = CarRequestBodySchema.extend({
    created_by: MongoDBObjectIdSchema,
    last_modified_by: MongoDBObjectIdSchema,
})
