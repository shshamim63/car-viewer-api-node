import { Types } from 'mongoose'
import { AppError } from '../utils/appError'

import { RefreshToken, User } from '../model/user.model'
import {
    MongoUser,
    NewUser,
    UserRole,
    UserStatus,
    UserUpdateAbleFields,
} from '../interfaces/user.interface'
import { MongoQuery } from '../interfaces/mongo.interface'

export const createUser = async (data: NewUser): Promise<MongoUser> => {
    try {
        const user = await User.create(data)
        return user.toObject()
    } catch (error) {
        const { code, keyValue } = error
        if (code === 11000) {
            throw new AppError(409, `User already exists`, keyValue)
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

export const findAndUpdateUser = async (
    filter: MongoQuery,
    payload: Partial<UserUpdateAbleFields>
) => {
    try {
        const response = await User.findOneAndUpdate(filter, payload, {
            new: true,
        })
        if (!response) throw new AppError(404, "User doesn't exist")
        return response
    } catch (error) {
        if (error instanceof AppError) throw error
        throw new AppError(500, 'Server error')
    }
}

export const findRefreshToken = async (token: string) => {
    try {
        const currentToken = await RefreshToken.findOne({ token: token })
        if (!currentToken) return null
        return currentToken.toObject()
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

export const removeToken = async (query: MongoQuery): Promise<number> => {
    try {
        const { deletedCount } = await RefreshToken.deleteOne(query)
        return deletedCount
    } catch (error) {
        throw new AppError(500, 'Server Error')
    }
}
