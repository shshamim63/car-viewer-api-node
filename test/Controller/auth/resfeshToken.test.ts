import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as authService from '../../../src/service/auth.service'

import { mongoConfig } from '../../../src/config'

describe('Auth/User/Activation', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoConfig.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        await mongoose.connection.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    describe('Request Header validation', () => {
        test('Should thorw error when header does not contain token', async () => {
            const response = await request(app).post('/auth/refresh/token')
            expect(response.status).toEqual(400)
            expect(
                JSON.parse(response.text).description.find((context) =>
                    context.path.includes('token')
                )
            ).toBeTruthy()
        })
        test('Should not throw validation error when header contains token', async () => {
            jest.spyOn(authService, 'refreshToken').mockResolvedValue({
                accessToken: faker.string.hexadecimal({ length: 64 }),
            })
            const token = faker.string.hexadecimal({ length: 64 })
            const response = await request(app)
                .post('/auth/refresh/token')
                .set('token', token)
            expect(response.status).toEqual(200)
            expect(JSON.parse(response.text).data.accessToken).toBeTruthy()
            expect(authService.refreshToken).toHaveBeenCalled()
        })
    })
    describe('Refresh token success', () => {
        test('Should provide new token when user is present', async () => {
            const demoPassword = faker.internet.password()
            const userRequestBody = {
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: demoPassword,
                confirmPassword: demoPassword,
            }
            await request(app).post('/auth/registration').send(userRequestBody)
            const loginResponse = await request(app).post('/auth/login').send({
                email: userRequestBody.email,
                password: userRequestBody.password,
            })
            const { refreshToken } = JSON.parse(loginResponse.text).data
            const response = await request(app)
                .post('/auth/refresh/token')
                .set('token', refreshToken)
            expect(response.status).toEqual(200)
            expect(JSON.parse(response.text).data.accessToken).toBeTruthy()
        })
    })
})
