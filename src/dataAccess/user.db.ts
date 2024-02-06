import mongoose from 'mongoose'

import { AppError } from '../util/appError'
import { IAuthenticatedUser, IUser } from '../model/user/user.model'
import { RefreshToken, User } from '../model/user/user.mongo.schema'
import { convertToUserResponse } from '../presenter/auth.serialize'
import { authConfig } from '../config'
import { generateToken } from '../util/jwt'

export const createUser = async (data: IUser): Promise<IUser> => {
    const savedUser = await User.create(data)
    return savedUser
}

export const findOneUser = async (query: any): Promise<IUser | null> => {
    const user = await User.findOne(query)
    if (!user || !Object.keys(user).length) {
        return null
    }
    return user
}

export const findAndUpdateUserById = async (id: string, body: IUser) => {
    try {
        const response = await User.findOneAndUpdate(
            new mongoose.Types.ObjectId(id),
            body
        )
        return convertToUserResponse(response)
    } catch (error) {
        throw new AppError(404, "User doesn't exist")
    }
}

export const generateAccessInfo = async (
    user: IUser
): Promise<Partial<IAuthenticatedUser>> => {
    const accessToken = generateToken(user, authConfig.accessTokenSecret, '15m')
    return {
        ...user,
        accessToken,
    }
}

export const generateAuthenticatedUserInfo = async (
    user: IUser
): Promise<IAuthenticatedUser> => {
    const accessinfo = await generateAccessInfo(user)
    const refreshToken = generateToken(
        user,
        authConfig.refreshTokenSecret,
        '1d'
    )

    if (refreshToken) {
        await saveRefreshToken(refreshToken, user.id)
    }

    return {
        ...accessinfo,
        refreshToken,
    }
}

export const saveRefreshToken = async (
    refreshToken: string,
    userId: string
) => {
    const token = new RefreshToken({ userId: userId, token: refreshToken })
    await token.save()
}
