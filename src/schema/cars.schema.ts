import { z } from "zod";

const carsSchema = z.object({
  name: z.string().min(5).max(30),
  manufactureYear: z.string().regex(new RegExp('/^d{4}$/'))
  availableColors: z.array() 
})