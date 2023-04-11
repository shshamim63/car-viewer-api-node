import { z } from 'zod'
import { CarSchema } from './cars.schema'

export type Car = z.infer<typeof CarSchema>
