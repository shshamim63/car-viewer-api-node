import { z } from 'zod'
import { CarSchema, CarBrandSchema } from './cars.schema'

export type ICar = z.infer<typeof CarSchema>
export type ICarBrand = z.infer<typeof CarBrandSchema>