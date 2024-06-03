import bcrypt from 'bcrypt'
import { NextFunction } from 'express'

import * as userDB from '../repositories/user.repository'

import { appConfig, authConfig } from '../config'
import { SALTROUNDS } from '../const'
import { generateToken, verifyToken } from '../utils/jwt'

import { AppError } from '../utils/appError'
import {
    ERROR_DESCCRIPTION,
    STATUS_CODES,
    RESPONSE_MESSAGE,
} from '../const/error'
import { RESPONSE_DESCRIPTION } from '../const/description'

import * as MailHelper from '../utils/mailer'

import {
    ActivateAccountQuery,
    AuthenticatedUser,
    LoginRequestBody,
    SignupRequestBody,
    UserStatus,
} from '../interfaces/user.interface'
import { userSerializer } from '../serialization/auth.serializer'
import { logger } from '../utils/logger'

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
                    STATUS_CODES.FORBIDDEN,
                    RESPONSE_MESSAGE.FORBIDDEN,
                    ERROR_DESCCRIPTION.USER_ACTIVE
                )
            await userDB.findAndUpdateUser(
                { _id: decodedUser.id, status: UserStatus.Inactive },
                { status: UserStatus.Active }
            )
            return RESPONSE_DESCRIPTION.ACTIVATION_SUCCESS
        } else {
            throw new AppError(
                STATUS_CODES.FORBIDDEN,
                RESPONSE_MESSAGE.FORBIDDEN,
                ERROR_DESCCRIPTION.USER_ACTIVE
            )
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
                STATUS_CODES.NOT_FOUND,
                RESPONSE_MESSAGE.NOT_FOUND,
                `${RESPONSE_MESSAGE.NOT_FOUND} with email: ${body.email}`
            )

        const authenticate = await bcrypt.compare(
            body.password,
            currentUser.passwordHash
        )
        if (!authenticate)
            throw new AppError(
                STATUS_CODES.UNAUTHORIZED,
                RESPONSE_MESSAGE.UNAUTHORIZED,
                ERROR_DESCCRIPTION.INVALID_PASSWORD
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
        const isTokenValid = verifyToken(token, authConfig.refreshTokenSecret)

        if (!isTokenValid)
            throw new AppError(
                STATUS_CODES.UNAUTHORIZED,
                RESPONSE_MESSAGE.UNAUTHORIZED,
                ERROR_DESCCRIPTION.INVALID_TOKEN
            )

        const deleteStatus = await userDB.removeToken({
            userId: isTokenValid.id,
            token: token,
        })

        if (!deleteStatus) {
            logger.info(ERROR_DESCCRIPTION.INVALID_TOKEN_ACCESS)
            throw new AppError(
                STATUS_CODES.NOT_FOUND,
                RESPONSE_MESSAGE.NOT_FOUND,
                ERROR_DESCCRIPTION.INVALID_TOKEN
            )
        }

        return RESPONSE_DESCRIPTION.LOGOUT_SUCCESS
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

        return RESPONSE_DESCRIPTION.REGISTRATION_SUCCESSFULL
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (
    refresh_token: string,
    next: NextFunction
): Promise<AuthenticatedUser> => {
    try {
        const currentToken = await userDB.findRefreshToken(refresh_token)

        if (!currentToken) throw new AppError(403, 'Token is not whitelisted')

        const user = verifyToken(refresh_token, authConfig.refreshTokenSecret)
        const currentUser = await userDB.findOneUser({ _id: user.id })

        if (!currentUser)
            throw new AppError(
                STATUS_CODES.FORBIDDEN,
                RESPONSE_MESSAGE.FORBIDDEN
            )

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
