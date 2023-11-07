import {model, Schema} from "mongoose";
import {ICar} from "./cars.model";
import {string, z} from "zod";

const carSchema = new Schema<ICar>(
    {
        name: { type: String, required: true, index: { unique: true } },
        manufacturedAt: { type: String, required: true },
        images: {type: [String], default: []},
    },
    { timestamps: true }
)

export const Car = model<ICar>('Car', carSchema)
