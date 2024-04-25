import bcrypt from 'bcrypt'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

import * as userDB from '../../../src/repositories/user.repository'

import {
    generateLoginCredentials,
    invalidSchemaMessage,
    mongodbUser,
} from '../../data/user.data'

describe('Auth/Login', () => {
    let findUserSpy
    let bcryptSpy
    let saveRefreshTokenSpy

    beforeEach(() => {
        findUserSpy = jest.spyOn(userDB, 'findOneUser')
        bcryptSpy = jest.spyOn(bcrypt, 'compare')
        saveRefreshTokenSpy = jest
            .spyOn(userDB, 'saveRefreshToken')
            .mockImplementation(() => Promise.resolve())
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const loginCredentials = generateLoginCredentials()
    describe('Request body validation', () => {
        test('Response should have code 400 when email and password is missing', async () => {
            const response = await request(app).post('/auth/login').send({})
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(400)
            expect(message).toEqual(invalidSchemaMessage)
            expect(description.length).toEqual(2)
        })
        describe('Validation/RequestBody', () => {
            test('Response should have code 400 when email is invalid', async () => {
                const response = await request(app)
                    .post('/auth/login')
                    .send({
                        ...loginCredentials,
                        email: faker.internet.userName(),
                    })
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0]).toMatchObject({
                    validation: expect.any(String),
                    code: expect.any(String),
                    message: expect.any(String),
                    path: expect.any(Array),
                })
            })
            test('Response should have code 400 when password has less than 8 characters', async () => {
                const response = await request(app)
                    .post('/auth/login')
                    .send({
                        ...loginCredentials,
                        password: faker.string.alpha({ length: 6 }),
                    })
                const { status, body } = response
                const { description } = body
                expect(status).toEqual(400)
                expect(body).toMatchObject({
                    message: expect.any(String),
                    description: expect.any(Array),
                })
                expect(description[0]).toMatchObject({
                    code: expect.any(String),
                    minimum: expect.any(Number),
                    type: expect.any(String),
                    inclusive: expect.any(Boolean),
                    exact: expect.any(Boolean),
                    message: expect.any(String),
                    path: expect.any(Array),
                })
            })
        })
        describe('Login Flow', () => {
            test('Response should have code 404 when user with email does not exist', async () => {
                findUserSpy.mockResolvedValue(null)
                const response = await request(app)
                    .post('/auth/login')
                    .send(loginCredentials)
                const { status, body } = response
                expect(body).toMatchObject({
                    message: expect.any(String),
                    description: expect.any(String),
                })
                expect(body.description.includes(loginCredentials.email))
                expect(status).toEqual(404)
            })
            test('Response should have code 401 when password is invalid', async () => {
                findUserSpy.mockResolvedValue(mongodbUser())
                bcryptSpy.mockImplementationOnce(() => Promise.resolve(false))
                const response = await request(app)
                    .post('/auth/login')
                    .send(loginCredentials)
                const { status, body } = response
                expect(status).toEqual(401)
                expect(body).toMatchObject({
                    message: expect.any(String),
                    description: expect.any(String),
                })
            })
            test('Response should have code 200 when valid credential has been provided', async () => {
                findUserSpy.mockResolvedValue(mongodbUser())
                bcryptSpy.mockImplementationOnce(() => Promise.resolve(true))

                const response = await request(app)
                    .post('/auth/login')
                    .send(loginCredentials)
                const {
                    status,
                    body: { data },
                } = response
                expect(data).toMatchObject({
                    avatar: expect.any(String),
                    createdAt: expect.any(String),
                    email: expect.any(String),
                    id: expect.any(String),
                    role: expect.any(String),
                    status: expect.any(String),
                    updatedAt: expect.any(String),
                    username: expect.any(String),
                    type: expect.any(String),
                })
                expect(saveRefreshTokenSpy).toHaveBeenCalled()
                expect(status).toEqual(200)
            })
        })
    })
})
