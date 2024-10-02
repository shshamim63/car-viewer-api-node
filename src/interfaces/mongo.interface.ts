import { z } from 'zod'
import { MongoDBObjectIdSchema } from '../validators/common.validator'

export interface MongoQuery {
    [key: string]: any
}

export type MongoObjectId = z.infer<typeof MongoDBObjectIdSchema>

export interface MongoTimeStamp {
    createdAt: Date
    updatedAt: Date
}
