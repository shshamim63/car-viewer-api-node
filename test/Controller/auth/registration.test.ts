import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

import * as MailHelper from '../../../src/utils/mailer'
import * as userDB from '../../../src/repositories/user.repository'

import { SignupRequestBody } from '../../../src/interfaces/user.interface'
import { AppError } from '../../../src/utils/appError'
import {
    mongodbUser,
    generateSignupRequestBody,
    invalidSchemaMessage,
} from '../../data/user.data'

describe('Auth/Registration', () => {
    let createUserSpy
    let mailSpy
    beforeEach(() => {
        createUserSpy = jest
            .spyOn(userDB, 'createUser')
            .mockResolvedValue(mongodbUser())
        mailSpy = jest
            .spyOn(MailHelper, 'sendMailToUser')
            .mockResolvedValue({ response: 'Email sent successfully' })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    describe('Request Body validation', () => {
        test('Response should have 400 status code ', async () => {
            const signupPayload = {} as SignupRequestBody
            const response = await request(app)
                .post('/auth/registration')
                .send(signupPayload)
            const { status, body } = response
            const { message, description } = body
            expect(status).toEqual(400)
            expect(body).toMatchObject({
                message: expect.any(String),
                description: expect.any(Array),
            })
            expect(message).toEqual(invalidSchemaMessage)
            expect(description.length).toEqual(4)
        })
        describe('Validation/Email', () => {
            test('Response should send code 400 with Invalid schema message when email is invalid', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.email = 'demo@gmailcom'
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)

                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].validation).toEqual('email')
            })

            test('Response should send code 201', async () => {
                const signupPayload = generateSignupRequestBody()
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                expect(response.status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
        })
        describe('Validation/Username', () => {
            test('Response should have code 400 with Invalid schema message when username is not present', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.username = ''
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)

                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].path.includes('username')).toBeTruthy()
            })

            test('Response should have code 400 with username invalid message as the length of the username is less than 6', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.username = faker.string.alpha(5)
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].code).toEqual('too_small')
                expect(description[0].minimum).toEqual(8)
                expect(description[0].message).toEqual(
                    'String must contain at least 8 character(s)'
                )
            })
            test('Response should have code 201', async () => {
                const signupPayload = generateSignupRequestBody()
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)

                const { status } = response
                expect(status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
        })
        describe('Validation/Avatar', () => {
            test('Response should have code 400 with Invalid schema when avatar is not an url', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.avatar = faker.person.fullName()
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)

                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].path.includes('avatar')).toBeTruthy()
            })
            test('Response should have code 201', async () => {
                const signupPayload = generateSignupRequestBody()
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)

                const { status } = response
                expect(status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
        })
        describe('Validation/Password', () => {
            test('Respond should have code 400 when password is invalid', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.password = ''
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].code).toEqual('too_small')
                expect(description[0].minimum).toEqual(8)
                expect(description[0].message).toEqual(
                    'String must contain at least 8 character(s)'
                )
            })
            test('Reponse should have 201 status when password is valid', async () => {
                const signupPayload = generateSignupRequestBody()
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const { status } = response
                expect(status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
        })
        describe('Validation/confirmPassword', () => {
            const signupPayload = generateSignupRequestBody()
            test('Response should have code 400 when confirm password is invalid', async () => {
                signupPayload.confirmPassword = ''
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
                expect(description[0].message).toEqual(
                    'String must contain at least 8 character(s)'
                )
            })
            test('Response should have code 201 when confirm password is valid', async () => {
                signupPayload.confirmPassword = signupPayload.password
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const { status } = response
                expect(status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
        })
        describe('Create User', () => {
            const signupPayload = generateSignupRequestBody()
            test('Response should have code 201 when user is created', async () => {
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const { status } = response
                expect(status).toEqual(201)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
            })
            test('Response should have code 409 as user with the email already exists', async () => {
                const errorKeyValue = {
                    email: signupPayload.email,
                }

                createUserSpy.mockImplementationOnce(() => {
                    throw new AppError(
                        409,
                        `User already exists`,
                        JSON.stringify(errorKeyValue)
                    )
                })

                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const {
                    status,
                    body: { message, description },
                } = response
                expect(status).toEqual(409)
                expect(message).toEqual('User already exists')
                expect(JSON.parse(description)).toMatchObject({
                    email: expect.any(String),
                })
            })
        })
    })
})
