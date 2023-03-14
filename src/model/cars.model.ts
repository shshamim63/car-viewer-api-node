import { z } from 'zod'
import { CarSchema } from "../schema/cars.schema";

export type Car = z.infer<typeof CarSchema>;