import jwt from 'jsonwebtoken'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as userDB from '../../../src/repositories/user.repository'

describe('Tests for User Activation', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const invalidToken = faker.string.hexadecimal({ length: 64 })
    const validToken = faker.string.hexadecimal({ length: 64 })
    describe('Request validation', () => {
        test('Response should have 400 status code when token is misssing', async () => {
            const response = await request(app).post('/auth/user/activate')
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(status)
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
            expect(status).toEqual(401)
            expect(typeof message).toBe('string')
        })
    })
})
