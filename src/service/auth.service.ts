import bcrypt from 'bcrypt'
import { NextFunction } from 'express'

import * as userDB from '../dataAccess/user.repository'

import { appConfig, authConfig } from '../config'
import { SALTROUNDS } from '../const'
import { generateToken, verifyToken } from '../util/jwt'

import { AppError } from '../util/appError'

import * as MailHelper from '../util/mailer'

import {
    ActivateAccountQuery,
    AuthenticatedUser,
    LoginRequestBody,
    SignupRequestBody,
    UserStatus,
} from '../interfaces/user.interface'
import { userSerializer } from '../serialization/auth.serializer'

export const activateAccount = async (
    query: ActivateAccountQuery,
    next: NextFunction
) => {
    try {
        const decodedUser = verifyToken(
            query.token,
            authConfig.accessTokenSecret
        )

        if (decodedUser.status === UserStatus.Inactive) {
            const currentUser = await userDB.findOneUser({
                _id: decodedUser.id,
            })
            if (currentUser.status === UserStatus.Active)
                throw new AppError(
                    400,
                    'The user already has an active account'
                )
            await userDB.findAndUpdateUser(
                { _id: decodedUser.id, status: UserStatus.Inactive },
                { status: UserStatus.Active }
            )
            return 'Account activated successfully'
        }
    } catch (error) {
        next(error)
    }
}

export const login = async (
    body: LoginRequestBody,
    next: NextFunction
): Promise<AuthenticatedUser> => {
    try {
        const query = {
            email: body.email,
        }

        const currentUser = await userDB.findOneUser(query)

        if (!currentUser)
            throw new AppError(
                404,
                'Invalid user credential',
                `User does not exist with email: ${body.email}`
            )

        const authenticate = await bcrypt.compare(
            body.password,
            currentUser.passwordHash
        )
        if (!authenticate)
            throw new AppError(
                401,
                'Invalid user credential',
                `Invalid password`
            )

        const serializedUser = userSerializer(currentUser)

        const accessToken = generateToken(
            serializedUser,
            authConfig.accessTokenSecret,
            '15m'
        )

        const refreshToken = generateToken(
            serializedUser,
            authConfig.refreshTokenSecret,
            '1d'
        )
        await userDB.saveRefreshToken(refreshToken, currentUser._id)
        return {
            ...serializedUser,
            refreshToken,
            accessToken,
            type: 'Bearer',
        }
    } catch (error) {
        next(error)
    }
}

export const logout = async (
    token: string,
    next: NextFunction
): Promise<string> => {
    try {
        const deleteStatus = await userDB.removeToken({ token: token })
        if (!deleteStatus) throw new AppError(401, 'Invalid credentials')
        return 'Logout successfull'
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (
    data: SignupRequestBody,
    next: NextFunction
): Promise<string> => {
    try {
        const newUser = {
            email: data.email,
            passwordHash: await bcrypt.hashSync(data.password, SALTROUNDS),
            avatar: data.avatar,
            username: data.username,
        }

        const user = await userDB.createUser(newUser)

        const userInfo = userSerializer(user)
        const activationToken = generateToken(
            userInfo,
            authConfig.accessTokenSecret,
            '2d'
        )

        const context = {
            url: `${appConfig.baseURL}/auth/user/activate?token=${activationToken}`,
            name: data.username,
        }

        MailHelper.sendMailToUser({
            email: data.email,
            context: context,
            template: 'verification-mail',
        })

        return 'Registration successful, please check email to verify your account'
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (
    refresh_token: string,
    next: NextFunction
): Promise<AuthenticatedUser> => {
    try {
        await userDB.findRefreshToken(refresh_token)
        const user = verifyToken(refresh_token, authConfig.refreshTokenSecret)
        const currentUser = await userDB.findOneUser({ _id: user.id })
        const serializedUser = userSerializer(currentUser)

        const accessToken = generateToken(
            serializedUser,
            authConfig.accessTokenSecret,
            '15m'
        )

        return {
            ...serializedUser,
            refreshToken: refresh_token,
            accessToken,
            type: 'Bearer',
        }
    } catch (error) {
        next(error)
    }
}
