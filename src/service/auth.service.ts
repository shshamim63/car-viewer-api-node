import bcrypt from 'bcrypt'

import * as userHelper from '../helper/user.helper'

import {
    IActivateUserQuery,
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
    IUser} from '../model/user/user.model'
import { User } from '../model/user/user.mongo.schema'
import { AppError } from '../middlewares/appError'
import { SALTROUNDS } from '../const'
import { authConfig } from '../config'

import { convertToUserResponse } from '../presenter/auth.serialize'
import  * as mailer from '../util/mailer'
import { ZodActiveStatusEnum } from '../model/user/user.schema'
import { generateToken, verifyToken } from '../helper/jwt.helper'

export const activateUserAccount = async (query: IActivateUserQuery) => {
    const decodedUser: IUser = verifyToken(query.token, authConfig.accessTokenSecret)
    const currentUser = await userHelper.findOneUser({_id: decodedUser.id})
    if(currentUser.status != 'Pending') throw new AppError(400, 'User is already active')
    const updatedUser = await userHelper.findAndUpdateUserById(currentUser.id, { status: ZodActiveStatusEnum.Enum.Active })
    return await userHelper.generateAuthenticatedUserInfo({...updatedUser, status: ZodActiveStatusEnum.Enum.Active })
}

export const login = async (body: ILoginBody): Promise<IAuthenticatedUser> => {
    const query = {
        email: body.email,
    }

    let user: IUser = null
    let authenticate = false

    try {
        user = await userHelper.findOneUser(query)
        if (user)
            authenticate = await bcrypt.compare(
                body.password,
                user.passwordHash
            )
        if (user && authenticate) {
            return await userHelper.generateAuthenticatedUserInfo(user)
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
        throw new AppError(401, 'Invalid user credential', `Invalid password`)
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
        const user = await userHelper.createUser(data)
        const userInfo = convertToUserResponse(user)
        const activationToken = generateToken(
            userInfo,
            authConfig.accessTokenSecret
        )
        mailer.sendConfirmationEmail(userInfo.username, userInfo.email, activationToken)
        return  'User was registered successfully! Please check your email'
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