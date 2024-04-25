import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

describe('Auth/User/Activation', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const token = faker.string.hexadecimal({ length: 64 })

    describe('Validation/token', () => {
        test('Response should have code 400 when a token is not provided', async () => {
            const response = await request(app).post('/auth/refresh/token')
            const { status, body } = response
            const { description } = body
            expect(status).toEqual(400)
            expect(body).toMatchObject({
                message: expect.any(String),
                description: expect.any(Array),
            })
            expect(description[0]).toMatchObject({
                code: expect.any(String),
                expected: expect.any(String),
                received: expect.any(String),
                path: expect.any(Array),
                message: expect.any(String),
            })
        })
    })
})
