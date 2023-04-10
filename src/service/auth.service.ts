import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser,
} from '../model/user.model'
import { RefreshToken, User } from '../schema/user/user.mongo.schema'
import { AppError } from '../util/appError'
import { SALTROUNDS } from '../util/constant'
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
        const user = await saveUser(data)
        return await generateAuthenticatedUserInfo(user)
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                400,
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
    const userinfo = convertToUserResponse(user)
    const accessToken = generateToken(
        userinfo,
        authConfig.accessTokenSecret,
        '15m'
    )
    const refreshToken = generateToken(
        userinfo,
        authConfig.refreshTokenSecret,
        '1d'
    )
    if (refreshToken) {
        await saveRefreshToken(refreshToken, userinfo._id)
    }
    return {
        ...userinfo,
        accessToken,
        refreshToken,
    }
}

const generateToken = (
    user: IUser,
    token: string,
    expiresIn: string
): string => {
    return jwt.sign({ ...user, _id: user._id.toString() }, token, {
        expiresIn: expiresIn,
    })
}

const saveUser = async (data: IUser): Promise<IUser> => {
    const user = new User(data)
    await user.save()
    return user
}

const saveRefreshToken = async (refreshToken: string, userId: string) => {
    const token = new RefreshToken({ userId: userId, token: refreshToken })
    await token.save()
}
