import { AppError } from '../util/appError'

import { RefreshToken, User } from '../model/user.model'
import { NewUser } from '../interfaces/user.interface'

export const createUser = async (data: NewUser): Promise<any> => {
    try {
        const user = await User.create(data)
        console.log('Saved user', user)
        return user
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, `User already exists`, error.keyValue)
        } else {
            throw new AppError(500, 'Server error')
        }
    }
}

export const findOneUser = async (query: any): Promise<any | null> => {
    try {
        const user = await User.findOne(query)
        return user
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}

export const findAndUpdateUser = async (filter: any, body: any) => {
    try {
        const response = await User.findOneAndUpdate(filter, body, {
            new: true,
        })
        //return convertToUserResponse(response)
    } catch (error) {
        throw new AppError(404, "User doesn't exist")
    }
}

export const findRefreshToken = async (token: string) => {
    try {
        const currentToken = RefreshToken.findOne({ token: token })
        if (!currentToken) throw new AppError(401, 'Unauthorized Request')
        return currentToken
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}

export const saveRefreshToken = async (
    refreshToken: string,
    userId: string
) => {
    try {
        const token = new RefreshToken({ userId: userId, token: refreshToken })
        await token.save()
    } catch (error) {
        throw new AppError(500, 'Server Error')
    }
}

export const deleteToken = async (query: any) => {
    try {
        await RefreshToken.deleteOne(query)
    } catch (error) {
        throw new AppError(500, 'Server Error')
    }
}
