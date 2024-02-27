import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

import { IRegistrationBody } from '../../../src/model/user/user.model'

describe('Auth/Registration', () => {
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
