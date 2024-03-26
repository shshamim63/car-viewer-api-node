import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as authService from '../../../src/service/auth.service'

import { mongoConfig } from '../../../src/config'
import { NextFunction } from 'express'

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
})
