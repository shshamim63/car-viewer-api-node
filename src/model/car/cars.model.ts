import { z } from 'zod'
import {
    CarRequestBodySchema,
    MongoCarSchema,
    MongoCarBrandSchema,
    CarBrandRequestBodySchema,
} from './cars.schema'

export type IMongoCar = z.infer<typeof MongoCarSchema>
export type IMongoCarBrand = z.infer<typeof MongoCarBrandSchema>
export type ICarRequestBody = z.infer<typeof CarRequestBodySchema>
export type ICarBrandRequestBody = z.infer<typeof CarBrandRequestBodySchema>
