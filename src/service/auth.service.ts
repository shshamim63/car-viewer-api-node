import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser,
} from '../model/user.model'
import { User } from '../schema/user/user.mongo.schema'
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
            const accessToken = generateToken(user, authConfig.accessTokenSecret, '15m')
            const refreshToken = generateToken(user, authConfig.refreshTokenSecret, '1d')
            return convertToUserResponse({
                ...user,
                accessToken,
                refreshToken,
                _id: user._id.toString(),
            })
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

export const registerUser = async (body: IRegistrationBody): Promise<IUser> => {
    const data: IUser = {
        email: body.email,
        passwordHash: await bcrypt.hashSync(body.password, SALTROUNDS),
        username: body.username,
        avatar: body.avatar ?? '',
    }
    try {
        const user = new User(data)
        await user.save()
        return user
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

const generateToken = (user: IUser, token: string, expiresIn: string): string => {
    return jwt.sign(
        { ...user, _id: user._id.toString() },
        token,
        { expiresIn: expiresIn }
    )
}
