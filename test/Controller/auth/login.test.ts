import request from 'supertest'
import { app } from '../../../src/app'
import mongoose from 'mongoose'

import * as authService from '../../../src/service/auth.service'
import {
    IAuthenticatedUser,
    ILoginBody,
    IRegistrationBody,
} from '../../../src/model/user/user.model'
import { AppError } from '../../../src/util/appError'
import { generateToken } from '../../../src/helper/jwt.helper'
import { authConfig } from '../../../src/config'
import {
    ZodActiveStatusEnum,
    ZodRoleEnum,
} from '../../../src/model/user/user.schema'

describe('auth/login', () => {
    const loginData: IRegistrationBody = {
        email: 'demo15@gmail.com',
        username: 'demo123',
        password: '123456789',
    }

    const userId = new mongoose.Types.ObjectId().toString()
    const profileId = new mongoose.Types.ObjectId().toString()

    const userData = {
        avatar: 'https://demo.png',
        createdAt: new Date(),
        email: 'demo15@gmail.com',
        id: userId,
        profileId: profileId,
        role: ZodRoleEnum.Enum.user,
        status: ZodActiveStatusEnum.Enum.Pending,
        updatedAt: new Date(),
        username: 'demo123',
        authorizationType: 'Bearer',
    }

    const authenticatedUser: IAuthenticatedUser = {
        ...userData,
        accessToken: generateToken(
            userData,
            authConfig.accessTokenSecret,
            '15m'
        ),
        refreshToken: generateToken(
            userData,
            authConfig.refreshTokenSecret,
            '1d'
        ),
    }

    describe('Validate login credentials', () => {
        const loginRequestBody: ILoginBody = {}
        test('It should throw error when request body does not contain any property', async () => {
            const loginMock = jest
                .spyOn(authService, 'login')
                .mockRejectedValue('Invalid Schema')
            const response = await request(app)
                .post('/user/login')
                .send(loginRequestBody)
            expect(loginMock).not.toHaveBeenCalled()
            expect(response.error.status).toEqual(400)
            expect(response._body.message).toEqual('Invalid Schema')
            expect(
                response._body.description.find((message) =>
                    message.path.includes('email')
                ).message
            ).toEqual('Required')
            expect(
                response._body.description.find((message) =>
                    message.path.includes('password')
                ).message
            ).toEqual('Required')
        })

        test('It should throw error when user with email does not exist', async () => {
            loginRequestBody['email'] = 'demo@gmail.com'
            loginRequestBody['password'] = '123456789'
            const loginMock = jest
                .spyOn(authService, 'login')
                .mockImplementation(() => {
                    throw new AppError(
                        404,
                        'Invalid user credential',
                        `User does not exist with email: ${loginRequestBody.email}`
                    )
                })

            const response = await request(app)
                .post('/user/login')
                .send(loginRequestBody)

            expect(loginMock).toHaveBeenCalled()
            expect(response.error.status).toEqual(404)
            expect(response._body.message).toEqual('Invalid user credential')
            expect(response._body.description).toEqual(
                `User does not exist with email: ${loginRequestBody.email}`
            )
        })

        test('It should throw error when password is invalid', async () => {
            const loginMock = jest
                .spyOn(authService, 'login')
                .mockImplementation(() => {
                    throw new AppError(
                        401,
                        'Invalid user credential',
                        `Invalid password`
                    )
                })
            loginRequestBody['email'] = loginData.email
            loginRequestBody['password'] = '987654123'
            const response = await request(app)
                .post('/user/login')
                .send(loginRequestBody)
            expect(loginMock).toHaveBeenCalled()
            expect(response.error.status).toEqual(401)
            expect(response._body.message).toEqual('Invalid user credential')
            expect(response._body.description).toEqual(`Invalid password`)
        })

        test('It should return success response when receive valid credential', async () => {
            const loginMock = jest
                .spyOn(authService, 'login')
                .mockResolvedValue(authenticatedUser)
            loginRequestBody['email'] = loginData.email
            loginRequestBody['password'] = loginData.password
            const response = await request(app)
                .post('/user/login')
                .send(loginRequestBody)
            expect(loginMock).toHaveBeenCalled()
            expect(response.status).toEqual(200)
        })
    })
})
