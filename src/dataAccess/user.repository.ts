import { Types } from 'mongoose'
import { AppError } from '../util/appError'

import { RefreshToken, User } from '../model/user.model'
import {
    MongoUser,
    NewUser,
    UserRole,
    UserStatus,
} from '../interfaces/user.interface'
import { MongoQuery } from '../interfaces/mongo.interface'

export const createUser = async (data: NewUser): Promise<any> => {
    try {
        const user = await User.create(data)
        return user.toObject()
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, `User already exists`, error.keyValue)
        } else {
            throw new AppError(500, 'Server error')
        }
    }
}

export const findOneUser = async (
    query: MongoQuery
): Promise<MongoUser | null> => {
    try {
        const user = await User.findOne(query)
        if (!user) return null
        const currentUser = user.toObject()
        const role = currentUser.role as UserRole
        const status = currentUser.status as UserStatus

        return { ...currentUser, role, status }
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
    userId: Types.ObjectId
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
