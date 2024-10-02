import { z } from 'zod'
import { Types } from 'mongoose'

import { CarRequestBodySchema } from '../validators/car.validator'
import { MongoTimeStamp } from './mongo.interface'

export type CarRequestBody = z.infer<typeof CarRequestBodySchema>

export interface NewCar extends CarRequestBody {
    created_by: Types.ObjectId
    last_modified_by: Types.ObjectId
}

export interface MongoCar extends NewCar, MongoTimeStamp {
    _id: Types.ObjectId
}
