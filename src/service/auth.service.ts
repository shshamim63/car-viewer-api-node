import bcrypt from 'bcrypt'

import * as userDB from '../dataAccess/user.db'

import { appConfig, authConfig } from '../config'
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
import { SALTROUNDS } from '../const'

import { convertToUserResponse } from '../presenter/auth.serialize'
import * as MailHelper from '../util/mailer'
import { NextFunction } from 'express'

export const activateUserAccount = async (
    query: IActivateUserQuery,
    next: NextFunction
) => {
    try {
        const decodedUser: IUser = verifyToken(
            query.token,
            authConfig.accessTokenSecret
        )
        console.log(decodedUser)
        return decodedUser
    } catch (error) {
        next(error)
    }

    // const updatedUser = await userDB.findAndUpdateUserById(currentUserInfo.id, {
    //     status: ZodActiveStatusEnum.Enum.Active,
    // })

    // return await userDB.generateAuthenticatedUserInfo({
    //     ...updatedUser,
    //     status: ZodActiveStatusEnum.Enum.Active,
    // })
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
    body: IRegistrationBody,
    next: NextFunction
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
