import { Types } from 'mongoose'
import { z } from 'zod'

export const MongoDBObjectIdSchema = z.instanceof(Types.ObjectId)
