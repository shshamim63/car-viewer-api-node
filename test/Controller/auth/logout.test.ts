import jwt from 'jsonwebtoken'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as userDB from '../../../src/repositories/user.repository'
import { tokenPayload } from '../../data/user.data'

describe('Logout testing', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetModules()
    })

    describe('Property validation', () => {
        test('Response should contain 400 when refresh_token is missing', async () => {
            const response = await request(app).post('/auth/logout')
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(400)
            expect(typeof message).toBe('string')
            expect(description[0]).toMatchObject({
                code: expect.any(String),
                expected: expect.any(String),
                received: expect.any(String),
                path: expect.any(Array),
                message: expect.any(String),
            })
        })
        test('Response should contain status 401 when token is invalid', async () => {
            const refreshToken = faker.string.hexadecimal({ length: 64 })
            const response = await request(app)
                .post('/auth/logout')
                .set('refresh_token', refreshToken)
            const {
                status,
                body: { message },
            } = response
            expect(status).toEqual(401)
            expect(typeof message).toBe('string')
        })
    })
    describe('Logout flow', () => {
        test('Response should contain status 401 when token is valid but is not present in the database', async () => {
            (jwt.verify as jest.Mock).mockReturnValue(tokenPayload)
            const refreshToken = faker.string.hexadecimal({ length: 64 })
            const deleteToken = jest
                .spyOn(userDB, 'removeToken')
                .mockImplementationOnce(() => Promise.resolve(0))
            const response = await request(app)
                .post('/auth/logout')
                .set('refresh_token', refreshToken)
            const {
                status,
                body: { message },
            } = response
            expect(status).toEqual(404)
            expect(typeof message).toBe('string')
            expect(deleteToken).toHaveBeenCalled()
        })
        test('Response should contain status 200 when token is valid and is whitelisted', async () => {
            (jwt.verify as jest.Mock).mockReturnValue(tokenPayload)
            const refreshToken = faker.string.hexadecimal({ length: 64 })
            const deleteToken = jest
                .spyOn(userDB, 'removeToken')
                .mockImplementationOnce(() => Promise.resolve(1))
            const response = await request(app)
                .post('/auth/logout')
                .set('refresh_token', refreshToken)
            const {
                status,
                body: { data },
            } = response
            expect(status).toEqual(200)
            expect(typeof data).toBe('string')
            expect(deleteToken).toHaveBeenCalled()
        })
    })
})
