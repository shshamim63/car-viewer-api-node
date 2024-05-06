import { z } from 'zod'

/*----------Request Body----------*/
export const CarRequestBodySchema = z.object({
    name: z.string().min(5).max(30),
    manufacturingYear: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
    images: z.string().array().default([]),
    brandId: z.string(),
    type: z.string(),
})

export const CarBrandRequestBodySchema = z.object({
    avatar: z.string().optional(),
    name: z.string().min(3).max(50),
    founded: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
    founder: z.string().min(5).max(50),
})

/*----------Request Body----------*/

/*----------Mongo----------*/

export const MongoCarSchema = CarRequestBodySchema.omit({
    manufacturedAt: true,
    brandId: true,
}).merge(
    z.object({
        brand_id: z.string(),
        manufacturing_year: z
            .string()
            .regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
                message: 'year must contain 4 digit. Eg: 2000',
            }),
    })
)

export const MongoCarBrandSchema = z.object({
    avatar: z.string().optional(),
    name: z.string().min(3).max(50),
    founded: z.string().regex(new RegExp('^20(1[1-9]|[2-9][0-9])$'), {
        message: 'year must contain 4 digit. Eg: 2000',
    }),
    founder: z.string().min(5).max(50),
})

/*----------Mongo----------*/
