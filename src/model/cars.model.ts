import { z } from 'zod'
import { CarSchema } from "../schema/car/cars.schema";

export type Car = z.infer<typeof CarSchema>;