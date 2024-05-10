import { model, Schema } from 'mongoose'

const carSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        manufacturing_year: { type: String, required: true },
        images: { type: [String], default: [] },
        type: { type: String, default: '' },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        last_modified_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        brandId: {
            type: Schema.Types.ObjectId,
            ref: 'CarBrand',
            required: true,
        },
    },
    { timestamps: true }
)

const carBrandSchema = new Schema({
    avatar: { type: String, required: false },
    name: { type: String, required: true },
    founded: { type: String, required: true },
    founder: { type: String, required: true },
})

export const Car = model('Car', carSchema)
export const CarBrand = model('CarBrand', carBrandSchema)
