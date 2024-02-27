import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'

import { app } from '../../../src/app'

import { IRegistrationBody } from '../../../src/model/user/user.model'
import { mongoConfig } from '../../../src/config'

describe('Auth/Registration', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoConfig.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    const requestBody = {} as IRegistrationBody
    describe('Request Body validation', () => {
        test('Should throw error when request body is invalid', async () => {
            const response = await request(app)
                .post('/auth/registration')
                .send(requestBody)
            expect(response.error.status).toEqual(400)
            expect(response._body.message).toEqual('Invalid Schema')
        })
    })
})
