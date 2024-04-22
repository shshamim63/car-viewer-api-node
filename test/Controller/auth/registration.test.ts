import request from 'supertest'

import { app } from '../../../src/app'

import * as MailHelper from '../../../src/util/mailer'
import * as userDB from '../../../src/dataAccess/user.repository'

import { CustomError } from './helper/error'
import { SignupRequestBody } from '../../../src/interfaces/user.interface'
import { createUserSeed, generateSignupRequestBody } from '../../data/user'
import { faker } from '@faker-js/faker'

describe('Auth/Registration', () => {
    let createUserSpy
    let mailSpy
    beforeEach(() => {
        createUserSpy = jest
            .spyOn(userDB, 'createUser')
            .mockResolvedValue(createUserSeed())
        mailSpy = jest
            .spyOn(MailHelper, 'sendMailToUser')
            .mockResolvedValue({ response: 'Email sent successfully' })
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })
    describe('Request Body validation', () => {
        const invalidSchemaMessage = 'Invalid Schema'
        test('Response should have 400 status code ', async () => {
            const signupPayload = {} as SignupRequestBody
            const response = await request(app)
                .post('/auth/registration')
                .send(signupPayload)
            const {
                status,
                body: { message, description },
            } = response
            expect(status).toEqual(400)
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
                expect(
                    description.find(
                        (context) => context.validation === 'email'
                    )
                ).toBeTruthy()
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
                expect(
                    description.find((context) =>
                        context.path.includes('username')
                    )
                ).toBeTruthy()
            })

            test('Response should have code 400 with username invalid message as the length of the username is less than 6', async () => {
                const signupPayload = generateSignupRequestBody()
                signupPayload.username = faker.string.alpha(5)
                const response = await request(app)
                    .post('/auth/registration')
                    .send(signupPayload)
                const {
                    status,
                    body: { message },
                } = response
                expect(status).toEqual(400)
                expect(message).toEqual(invalidSchemaMessage)
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
                expect(
                    description.find((context) =>
                        context.path.includes('avatar')
                    )
                ).toBeTruthy()
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
    })
})
