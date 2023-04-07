import { Schema, model } from 'mongoose'
import { IUser } from '../../model/user.model'

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, index: { unique: true } },
        username: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true, unique: true },
        profileId: { type: String, required: false, default: null },
        avatar: { type: String, required: false, default: '' },
    },
    { timestamps: true }
)

export const User = model<IUser>('User', userSchema)
