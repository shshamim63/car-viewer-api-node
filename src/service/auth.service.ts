import bcrypt from 'bcrypt'
import { NextFunction } from 'express'

import * as userDB from '../dataAccess/user.db'

import { appConfig, authConfig } from '../config'
import { SALTROUNDS } from '../const'
import { generateToken, verifyToken } from '../util/jwt'

import {
    IActivateUserQuery,
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser,
} from '../model/user/user.model'
import { ZodActiveStatusEnum } from '../model/user/user.schema'

import { AppError } from '../util/appError'

import { convertToUserResponse } from '../presenter/auth.serialize'
import * as MailHelper from '../util/mailer'

export const activateUserAccount = async (
    query: IActivateUserQuery,
    next: NextFunction
) => {
    try {
        const decodedUser: IUser = verifyToken(
            query.token,
            authConfig.accessTokenSecret
        )
        const updatedUser = await userDB.findAndUpdateUser(
            { _id: decodedUser.id, status: ZodActiveStatusEnum.Enum.Pending },
            { status: ZodActiveStatusEnum.Enum.Active }
        )
        return await userDB.generateAuthenticatedUserInfo(updatedUser)
    } catch (error) {
        next(error)
    }
}

export const login = async (
    body: ILoginBody,
    next: NextFunction
): Promise<IAuthenticatedUser> => {
    try {
        const query = {
            email: body.email,
        }

        const user = await userDB.findOneUser(query)
        if (!user)
            throw new AppError(
                404,
                'Invalid user credential',
                `User does not exist with email: ${body.email}`
            )
        const authenticate =
            user && (await bcrypt.compare(body.password, user.passwordHash))

        if (!authenticate)
            throw new AppError(
                401,
                'Invalid user credential',
                `Invalid password`
            )
        const userInfo = convertToUserResponse(user)
        return await userDB.generateAuthenticatedUserInfo(userInfo)
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (
    body: IRegistrationBody,
    next: NextFunction
): Promise<string> => {
    try {
        const data: IUser = {
            email: body.email,
            passwordHash: await bcrypt.hashSync(body.password, SALTROUNDS),
            username: body.username,
            avatar: body.avatar ?? '',
        }

        const user = await userDB.createUser(data)

        const userInfo = convertToUserResponse(user)

        const activationToken = generateToken(
            userInfo,
            authConfig.accessTokenSecret
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

export const refreshToken = async (token: string, next: NextFunction) => {
    try {
        const decodedUser: IUser = verifyToken(
            token,
            authConfig.refreshTokenSecret
        )
        const currentUser = await userDB.findOneUser({ _id: decodedUser.id })
        if (!currentUser) throw new AppError(401, 'Invalid user credential')

        const userInfo = convertToUserResponse(currentUser)
        return await userDB.generateAccessInfo(userInfo)
    } catch (error) {
        next(error)
    }
}
