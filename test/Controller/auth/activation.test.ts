import jwt from 'jsonwebtoken'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as userDB from '../../../src/repositories/user.repository'
import { mongodbUser } from '../../data/user.data'
import { UserStatus } from '../../../src/interfaces/user.interface'
import {
    ERROR_DESCCRIPTION,
    RESPONSE_MESSAGE,
    STATUS_CODES,
} from '../../../src/const/error'

describe('Tests for User Activation', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const invalidToken = faker.string.hexadecimal({ length: 64 })
    const validToken = faker.string.hexadecimal({ length: 64 })
    const alreadyActiveMessageContext = 'The user already has an active account'
    describe('Request validation', () => {
        test('Response should have 400 status code when token is misssing', async () => {
            const response = await request(app).post('/auth/user/activate')
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(STATUS_CODES.BAD_REQUEST)
            expect(typeof message).toBe('string')
            expect(description[0]).toMatchObject({
                code: expect.any(String),
                expected: expect.any(String),
                received: expect.any(String),
                path: expect.any(Array),
                message: expect.any(String),
            })
        })
    })
    describe('Activation flow confirm', () => {
        test('Response should have 401 status code when token is invalid', async () => {
            const response = await request(app).post(
                `/auth/user/activate?token=${invalidToken}`
            )
            const {
                status,
                body: { message },
            } = response
            expect(status).toEqual(STATUS_CODES.UNAUTHORIZED)
            expect(typeof message).toBe('string')
        })
        test('Response should have 403 status code when decoded user has activated status', async () => {
            const mongoUser = await mongodbUser()
            ;(jwt.verify as jest.Mock).mockReturnValue({
                ...mongoUser,
                status: UserStatus.Active,
            })
            const response = await request(app).post(
                `/auth/user/activate?token=${validToken}`
            )
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(STATUS_CODES.FORBIDDEN)
            expect(message).toEqual(RESPONSE_MESSAGE.FORBIDDEN)
            expect(description).toEqual(ERROR_DESCCRIPTION.USER_ACTIVE)
        })
        test('Response should have 403 status code when current user has activated status', async () => {
            const mongoUser = await mongodbUser()
            const findUserSpy = jest
                .spyOn(userDB, 'findOneUser')
                .mockImplementationOnce(() =>
                    Promise.resolve({ ...mongoUser, status: UserStatus.Active })
                )
            ;(jwt.verify as jest.Mock).mockReturnValue(mongoUser)
            const response = await request(app).post(
                `/auth/user/activate?token=${validToken}`
            )
            const {
                status,
                body: { message },
            } = response
            expect(findUserSpy).toHaveBeenCalled()
            expect(status).toBe(STATUS_CODES.FORBIDDEN)
            expect(typeof message).toBe('string')
        })
        test('Response should have status 200 when token is valid and user is inavtive', async () => {
            const mongoUser = await mongodbUser()
            const findUserSpy = jest
                .spyOn(userDB, 'findOneUser')
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        ...mongoUser,
                        status: UserStatus.Inactive,
                    })
                )
            const findAndUpdateUserSpy = jest
                .spyOn(userDB, 'findAndUpdateUser')
                .mockImplementationOnce(() => Promise.resolve(mongoUser))
            ;(jwt.verify as jest.Mock).mockReturnValue(mongoUser)
            const response = await request(app).post(
                `/auth/user/activate?token=${validToken}`
            )
            const {
                status,
                body: { data },
            } = response
            expect(findUserSpy).toHaveBeenCalled()
            expect(findAndUpdateUserSpy).toHaveBeenCalled()
            expect(status).toBe(STATUS_CODES.OK)
            expect(typeof data).toBe('string')
        })
    })
})
