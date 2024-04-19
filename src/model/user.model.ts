import { Schema, model } from 'mongoose'
import { ACTIVESTATUS, ROLE } from '../const'

const UserSchema = new Schema(
    {
        avatar: { type: String, required: false, default: '' },
        email: { type: String, required: true, index: { unique: true } },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ROLE, default: 'user' },
        status: { type: String, enum: ACTIVESTATUS, default: 'Pending' },
        username: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

const ProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
)

const RefreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        token: { type: String, required: true },
    },
    { timestamps: true }
)

RefreshTokenSchema.index({ userId: 1, token: 1 }, { unique: true })
RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

UserSchema.post('save', async function (doc, next) {
    try {
        await Profile.create({ user: doc._id })
        next()
    } catch (error) {
        next(error)
    }
})

export const User = model('User', UserSchema)
export const Profile = model('Profile', ProfileSchema)
export const RefreshToken = model('AuthToken', RefreshTokenSchema)
