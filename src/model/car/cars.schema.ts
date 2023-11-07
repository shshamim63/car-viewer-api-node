import { z } from 'zod'

export const CarSchema = z.object({
    name: z.string().min(5).max(30),
    manufacturedAt: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
    images: z.string().array(),
})

export const CarBrandSchema = z.object({
    avatar: z.string().optional(),
    name: z.string().min(3).max(50),
    founded: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
    founder: z.string().min(5).max(50)
})
