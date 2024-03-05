import bcrypt from 'bcrypt'

import * as userDB from '../dataAccess/user.db'

import {
    IActivateUserQuery,
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser,
} from '../model/user/user.model'
import { AppError } from '../util/appError'
import { SALTROUNDS } from '../const'
import { authConfig } from '../config'

import { convertToUserResponse } from '../presenter/auth.serialize'

import { ZodActiveStatusEnum } from '../model/user/user.schema'
import { generateToken, verifyToken } from '../util/jwt'

export const activateUserAccount = async (query: IActivateUserQuery) => {
    const decodedUser: IUser = verifyToken(
        query.token,
        authConfig.accessTokenSecret
    )

    const currentUser = await userDB.findOneUser({ _id: decodedUser.id })

    if (!currentUser)
        throw new AppError(
            404,
            'Invalid user credential',
            `User does not exist with email: ${decodedUser.email}`
        )

    const currentUserInfo = convertToUserResponse(currentUser)

    if (currentUserInfo.status != 'Pending')
        throw new AppError(400, 'User is already active')

    const updatedUser = await userDB.findAndUpdateUserById(currentUserInfo.id, {
        status: ZodActiveStatusEnum.Enum.Active,
    })

    return await userDB.generateAuthenticatedUserInfo({
        ...updatedUser,
        status: ZodActiveStatusEnum.Enum.Active,
    })
}

export const login = async (body: ILoginBody): Promise<IAuthenticatedUser> => {
    const query = {
        email: body.email,
    }

    let user: IUser = null
    let authenticate = false

    try {
        user = await userDB.findOneUser(query)
        if (user)
            authenticate = await bcrypt.compare(
                body.password,
                user.passwordHash
            )
    } catch (error) {
        throw new AppError(500, 'Server error')
    }

    if (!user)
        throw new AppError(
            404,
            'Invalid user credential',
            `User does not exist with email: ${body.email}`
        )
    if (!authenticate)
        throw new AppError(401, 'Invalid user credential', `Invalid password`)

    if (user && authenticate) {
        const userInfo = convertToUserResponse(user)
        return await userDB.generateAuthenticatedUserInfo(userInfo)
    }
}

export const registerUser = async (
    body: IRegistrationBody
): Promise<string> => {
    const data: IUser = {
        email: body.email,
        passwordHash: await bcrypt.hashSync(body.password, SALTROUNDS),
        username: body.username,
        avatar: body.avatar ?? '',
    }

    try {
        const user = await userDB.createUser(data)
        const userInfo = convertToUserResponse(user)
        const activationToken = generateToken(
            userInfo,
            authConfig.accessTokenSecret
        )
        return 'Registration successful, please check email to verify your account'
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

export const refreshToken = async (body: IActivateUserQuery) => {
    const decodedUser: IUser = verifyToken(
        body.token,
        authConfig.refreshTokenSecret
    )
    const currentUser = await userDB.findOneUser({ _id: decodedUser.id })
    if (!currentUser)
        throw new AppError(
            404,
            'Invalid user credential',
            `User does not exist with email: ${decodedUser.email}`
        )

    const userInfo = convertToUserResponse(currentUser)
    return await userDB.generateAccessInfo(userInfo)
}
