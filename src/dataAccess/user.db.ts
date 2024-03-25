import { AppError } from '../util/appError'
import { IAuthenticatedUser, IUser, Query } from '../model/user/user.model'
import { RefreshToken, User } from '../model/user/user.mongo.schema'
import { convertToUserResponse } from '../presenter/auth.serialize'
import { authConfig } from '../config'
import { generateToken } from '../util/jwt'

export const createUser = async (data: IUser): Promise<IUser> => {
    try {
        const savedUser = await User.create(data)
        return savedUser
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                409,
                `User exists with the following ${JSON.stringify(
                    error.keyValue
                )}`,
                error.keyValue
            )
        } else {
            throw new AppError(500, 'Server error')
        }
    }
}

export const findOneUser = async (query: Query): Promise<IUser | null> => {
    const user = await User.findOne(query)
    if (!user || !Object.keys(user).length) {
        return null
    }
    return user
}

export const findAndUpdateUser = async (filter: Query, body: IUser) => {
    try {
        const response = await User.findOneAndUpdate(filter, body, {
            new: true,
        })
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
