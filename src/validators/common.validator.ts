import { z } from 'zod'

export const MongoDBObjectIdSchema = z.string().refine(
    (val) => {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/
        return objectIdRegex.test(val)
    },
    {
        message: 'Invalid MongoDB ObjectID',
    }
)
