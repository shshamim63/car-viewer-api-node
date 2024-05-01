import jwt from 'jsonwebtoken'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as userDB from '../../../src/repositories/user.repository'
import {
    mongoRefreshToken,
    mongodbUser,
    tokenPayload,
} from '../../data/user.data'

describe('Tests for Rrefresh Token', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const token = faker.string.hexadecimal({ length: 64 })

    describe('Headers Validation', () => {
        test('Response should have code 400 when a token is missing', async () => {
            const response = await request(app).post('/auth/refresh/token')
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
    })
    describe('Refresh Token flow', () => {
        const findRefreshTokenSpy = jest.spyOn(userDB, 'findRefreshToken')
        const findOneUserSpy = jest.spyOn(userDB, 'findOneUser')
        test('Response should contain status code 403 when token is not whitelisted', async () => {
            findRefreshTokenSpy.mockImplementationOnce(() =>
                Promise.resolve(null)
            )
            const response = await request(app)
                .post('/auth/refresh/token')
                .set('refresh_token', token)
            const {
                status,
                body: { message },
            } = response
            expect(status).toEqual(403)
            expect(typeof message).toBe('string')
        })
        test('Response should contain status code 404 when user does not exist', async () => {
            findRefreshTokenSpy.mockResolvedValue(mongoRefreshToken(token))
            findOneUserSpy.mockImplementationOnce(() => Promise.resolve(null))
            ;(jwt.verify as jest.Mock).mockResolvedValue(tokenPayload)
            // ;(jwt.sign as jest.Mock).mockResolvedValue(token)
            const response = await request(app)
                .post('/auth/refresh/token')
                .set('refresh_token', token)
            const {
                status,
                body: { message },
            } = response
            expect(status).toEqual(404)
            expect(typeof message).toBe('string')
        })
        test('Response should contain status code 404 when user does not exist', async () => {
            findRefreshTokenSpy.mockResolvedValue(mongoRefreshToken(token))
            findOneUserSpy.mockImplementationOnce(() =>
                Promise.resolve(mongodbUser())
            )
            ;(jwt.verify as jest.Mock).mockResolvedValue(tokenPayload)
            ;(jwt.sign as jest.Mock).mockReturnValue(token)
            const response = await request(app)
                .post('/auth/refresh/token')
                .set('refresh_token', token)
            const {
                status,
                body: { data },
            } = response
            expect(status).toEqual(200)
            expect(data).toMatchObject({
                avatar: expect.any(String),
                createdAt: expect.any(String),
                email: expect.any(String),
                id: expect.any(String),
                role: expect.any(String),
                status: expect.any(String),
                updatedAt: expect.any(String),
                username: expect.any(String),
                refreshToken: expect.any(String),
                accessToken: expect.any(String),
                type: expect.any(String),
            })
        })
    })
})
