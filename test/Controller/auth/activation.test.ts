import jwt from 'jsonwebtoken'
import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as userDB from '../../../src/dataAccess/user.db'

import { mongoConfig } from '../../../src/config'
import { CustomError } from './helper/error'
import { User } from '../../../src/model/user/user.mongo.schema'

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}))

describe('Auth/User/Activation', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoConfig.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    describe('Request Query validation', () => {
        test('Should throw error when token property is not given', async () => {
            const data = await request(app).post('/auth/user/activate')
            expect(JSON.parse(data.text).message).toEqual('Invalid Schema')
            expect(data.status).toEqual(400)
        })
        test('Should throw error when token is invalid', async () => {
            jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
                throw new CustomError('invalid signature ', 401)
            })
            const data = await request(app).post(
                `/auth/user/activate?token=${faker.string.hexadecimal({
                    length: 64,
                })}`
            )
            expect(JSON.parse(data.text).message).toEqual(
                'Invalid authorization error'
            )
        })

        test('Should not throw error when data is valid', async () => {
            const user = {
                username: 'demouser',
                email: 'demo@gmail.com',
            }

            ;(jwt.verify as jest.Mock).mockReturnValueOnce(User)

            jest.spyOn(userDB, 'findAndUpdateUser').mockResolvedValue(user)
            jest.spyOn(
                userDB,
                'generateAuthenticatedUserInfo'
            ).mockResolvedValue(user)
            const data = await request(app).post(
                `/auth/user/activate?token=${faker.string.hexadecimal({
                    length: 64,
                })}`
            )
            const responseText = JSON.parse(data.text)
            expect(responseText.data.username).toEqual(user.username)
            expect(responseText.data.email).toEqual(user.email)
        })
    })
})
