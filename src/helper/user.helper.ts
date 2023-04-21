import mongoose from "mongoose"

import { AppError } from "../middlewares/appError"
import { IAuthenticatedUser, IUser } from "../model/user/user.model"
import { RefreshToken, User } from "../model/user/user.mongo.schema"
import { convertToUserResponse } from "../presenter/auth.serialize"
import { authConfig } from "../config"
import { generateToken } from "./jwt.helper"

export const createUser = async (data: IUser): Promise<IUser> => {
    const savedUser = await User.create(data)
    return savedUser
}

export const findOneUser = async (query: any) => {
    const user = await User.findOne(query)
    if(!user || !Object.keys(user)) throw new AppError(404, "User doesn't exist")
    return convertToUserResponse(user)
}

export const findAndUpdateUserById = async (id: string, body: IUser) => {
    try {
        const response = await User.findOneAndUpdate(new mongoose.Types.ObjectId(id), body)
        return convertToUserResponse(response)
    } catch (error) {
        throw new AppError(404, "User doesn't exist")
    }
}

export const generateAuthenticatedUserInfo = async (user: IUser): Promise<IAuthenticatedUser> => {
    const userInfo = convertToUserResponse(user)
    const accessToken = generateToken(
        userInfo,
        authConfig.accessTokenSecret,
        '15m'
    )
    const refreshToken = generateToken(
        userInfo,
        authConfig.refreshTokenSecret,
        '1d'
    )

    if (refreshToken) {
        await saveRefreshToken(refreshToken, userInfo.id)
    }
    return {
        ...userInfo,
        accessToken,
        refreshToken,
    }
}

export const saveRefreshToken = async (refreshToken: string, userId: string) => {
    const token = new RefreshToken({ userId: userId, token: refreshToken })
    await token.save()
}