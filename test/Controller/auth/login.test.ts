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

import { STATUS_CODES } from '../../../src/const/error'

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

    describe('Login Testing', () => {
        describe('Validation of RequestBody', () => {
            test('Response should have code 400 when email and password is missing', async () => {
                const response = await request(app).post('/auth/login').send({})
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(STATUS_CODES.BAD_REQUEST)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description.length).toEqual(2)
            })
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
                expect(status).toEqual(STATUS_CODES.BAD_REQUEST)
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
                expect(status).toEqual(STATUS_CODES.BAD_REQUEST)
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
        describe('Request body contains correct format of value', () => {
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
                expect(status).toEqual(STATUS_CODES.NOT_FOUND)
            })
            test('Response should have code 401 when password is incorrect', async () => {
                findUserSpy.mockResolvedValue(mongodbUser())
                bcryptSpy.mockImplementationOnce(() => Promise.resolve(false))
                const response = await request(app)
                    .post('/auth/login')
                    .send(loginCredentials)
                const { status, body } = response
                expect(status).toEqual(STATUS_CODES.UNAUTHORIZED)
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
                expect(status).toEqual(STATUS_CODES.OK)
            })
        })
    })
})
