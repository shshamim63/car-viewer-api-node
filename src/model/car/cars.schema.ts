import { z } from 'zod'

export const CarSchema = z.object({
    name: z.string().min(5).max(30),
    manufactureYear: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
})
