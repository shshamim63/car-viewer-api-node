import { model, Schema } from 'mongoose'
import { IMongoCar, IMongoCarBrand } from './cars.model'

const carSchema = new Schema<IMongoCar>(
    {
        name: { type: String, required: true, index: { unique: true } },
        manufacturing_year: { type: String, required: true },
        images: { type: [String], default: [] },
        type: { type: String, default: '' },
    },
    { timestamps: true }
)

const carBrandSchema = new Schema<IMongoCarBrand>({
    avatar: { type: String, required: false },
    name: { type: String, required: true },
    founded: { type: String, required: true },
    founder: { type: String, required: true },
})

export const Car = model<IMongoCar>('Car', carSchema)
export const CarBrand = model<IMongoCarBrand>('CarBrand', carBrandSchema)
