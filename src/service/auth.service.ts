import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser,
} from '../model/user/user.model'
import { RefreshToken, User } from '../model/user/user.mongo.schema'
import { AppError } from '../middlewares/appError'
import { SALTROUNDS } from '../const'
import { authConfig } from '../config'

import { convertToUserResponse } from '../presenter/auth.serialize'

export const login = async (body: ILoginBody): Promise<IAuthenticatedUser> => {
    const query = {
        email: body.email,
    }

    let user = null
    let authenticate = false

    try {
        user = (await User.findOne(query)).toJSON() as IUser
        if (user)
            authenticate = await bcrypt.compare(
                body.password,
                user.passwordHash
            )
        if (user && authenticate) {
            return await generateAuthenticatedUserInfo(user)
        }
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
        throw new AppError(404, 'Invalid user credential', `Invalid password`)
}

export const registerUser = async (
    body: IRegistrationBody
): Promise<IAuthenticatedUser> => {
    const data: IUser = {
        email: body.email,
        passwordHash: await bcrypt.hashSync(body.password, SALTROUNDS),
        username: body.username,
        avatar: body.avatar ?? '',
    }
    try {
        const user = await createUser(data)
        return await generateAuthenticatedUserInfo(user)
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                409,
                'User already exists with the following',
                error.keyValue
            )
        } else {
            throw new AppError(500, 'Server error')
        }
    }
}

/*---------**Private Methods**--------*/

const generateAuthenticatedUserInfo = async (user: IUser) => {
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

const generateToken = (
    user: IUser,
    token: string,
    expiresIn: string
): string => {
    return jwt.sign({ ...user, id: user.id }, token, {
        expiresIn: expiresIn,
    })
}

const createUser = async (data: IUser): Promise<IUser> => {
    const savedUser = await User.create(data)
    return savedUser
}

const saveRefreshToken = async (refreshToken: string, userId: string) => {
    const token = new RefreshToken({ userId: userId, token: refreshToken })
    await token.save()
}
