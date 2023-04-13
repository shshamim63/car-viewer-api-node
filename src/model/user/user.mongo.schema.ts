import { Schema, model } from 'mongoose'
import { IRefreshToken, IUser } from './user.model'
import { ACTIVESTATUS, ROLE } from '../../const'

const userSchema = new Schema<IUser>(
    {
        avatar: { type: String, required: false, default: '' },
        email: { type: String, required: true, index: { unique: true } },
        passwordHash: { type: String, required: true, unique: true },
        profileId: { type: String, required: false, default: null },
        role: { type: String, enum: ROLE, default: 'user' },
        status: { type: String, enum: ACTIVESTATUS, default: 'Pending'},
        username: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: { type: String, required: true },
        token: { type: String, required: true },
    },
    { timestamps: true }
)

RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

export const User = model<IUser>('User', userSchema)
export const RefreshToken = model<IRefreshToken>(
    'AuthToken',
    RefreshTokenSchema
)
