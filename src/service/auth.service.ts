import bcrypt from 'bcrypt'
import { NextFunction } from 'express'

import * as userDB from '../dataAccess/userRepository'

import { appConfig, authConfig } from '../config'
import { SALTROUNDS } from '../const'
import { generateToken, verifyToken } from '../util/jwt'

import { AppError } from '../util/appError'

import { convertToUserResponse } from '../serialization/auth.serializer'
import * as MailHelper from '../util/mailer'
import {
    LoginRequestBody,
    SignupRequestBody,
} from '../interfaces/user.interface'

// export const activateUserAccount = async (
//     query: any,
//     next: NextFunction
// ) => {
//     try {
//         const decodedUser: any = verifyToken(
//             query.token,
//             authConfig.accessTokenSecret
//         )
//         const updatedUser = await userDB.findAndUpdateUser(
//             { _id: decodedUser.id, status: ZodActiveStatusEnum.Enum.Pending },
//             { status: ZodActiveStatusEnum.Enum.Active }
//         )
//         return await userDB.generateAuthenticatedUserInfo(updatedUser)
//     } catch (error) {
//         next(error)
//     }
// }

export const login = async (
    body: LoginRequestBody,
    next: NextFunction
): Promise<any> => {
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

        const userInfo = convertToUserResponse(currentUser)
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
        await userDB.saveRefreshToken(refreshToken, currentUser.id)
        return {
            userInfo,
        }
    } catch (error) {
        next(error)
    }
}

// export const logout = async (
//     token: string,
//     next: NextFunction
// ): Promise<string> => {
//     try {
//         const decodedUser: IUser = verifyToken(
//             token,
//             authConfig.refreshTokenSecret
//         )
//         if (decodedUser) {
//             await userDB.deleteToken({ token: token })
//             return 'Logout successfull'
//         }
//     } catch (error) {
//         next(error)
//     }
// }

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

        // const userInfo = convertToUserResponse(user)

        // const activationToken = generateToken(
        //     userInfo,
        //     authConfig.accessTokenSecret
        // )

        // const context = {
        //     url: `${appConfig.baseURL}/auth/user/activate?token=${activationToken}`,
        //     name: data.username,
        // }

        // MailHelper.sendMailToUser({
        //     email: data.email,
        //     context: context,
        //     template: 'verification-mail',
        // })

        return 'Registration successful, please check email to verify your account'
    } catch (error) {
        next(error)
    }
}

// export const refreshToken = async (token: string, next: NextFunction) => {
//     try {
//         const validToken = userDB.findRefreshToken(token)
//         if (validToken) {
//             const decodedUser: IUser = verifyToken(
//                 token,
//                 authConfig.refreshTokenSecret
//             )
//             const currentUser = await userDB.findOneUser({
//                 _id: decodedUser.id,
//             })
//             if (!currentUser) throw new AppError(401, 'Invalid user credential')

//             const userInfo = convertToUserResponse(currentUser)
//             return await userDB.generateAccessInfo(userInfo)
//         }
//     } catch (error) {
//         next(error)
//     }
// }
