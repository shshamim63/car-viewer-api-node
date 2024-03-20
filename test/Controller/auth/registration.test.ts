import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'

import { app } from '../../../src/app'

import * as userDB from '../../../src/dataAccess/user.db'

import * as MailHelper from '../../../src/util/mailer'

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

    describe('Request Body validation', () => {
        const requestBody = {} as IRegistrationBody
        test('Should throw error when requst body is empty', async () => {
            const data = await request(app)
                .post('/auth/registration')
                .send(requestBody)

            const responseText = JSON.parse(data.text)
            expect(data.status).toEqual(400)
            expect(responseText.message).toEqual('Invalid Schema')
            expect(responseText.description.length).toEqual(4)
        })
        describe('Should validate email', () => {
            test('Should throw error when email is not valid', async () => {
                requestBody.email = 'demo@gmailcom'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)

                const responseText = JSON.parse(data.text)
                expect(data.status).toEqual(400)
                expect(responseText.message).toEqual('Invalid Schema')
                expect(
                    responseText.description.find(
                        (context) => context.validation === 'email'
                    )
                ).toBeTruthy()
            })

            test('Should not throw error when email is valid', async () => {
                requestBody.email = 'demo@gmail.com'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)

                const responseText = JSON.parse(data.text)
                expect(
                    responseText.description.find(
                        (context) => context.validation === 'email'
                    )
                ).toBeFalsy()
            })
        })
        describe('Should validate username', () => {
            test('Should throw error when username is not valid', async () => {
                requestBody.username = ''
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)

                const responseText = JSON.parse(data.text)
                expect(data.status).toEqual(400)
                expect(responseText.message).toEqual('Invalid Schema')
                expect(
                    responseText.description.find((context) =>
                        context.path.includes('username')
                    )
                ).toBeTruthy()
            })

            test('Should throw error when username has less than 6 characters', async () => {
                requestBody.username = 'demo'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)

                const responseText = JSON.parse(data.text)

                const userNameErrorContext = responseText.description.find(
                    (context) => context.path.includes('username')
                )

                expect(userNameErrorContext).toBeTruthy()

                expect(userNameErrorContext.message).toEqual(
                    'String must contain at least 6 character(s)'
                )
            })
            test('Should not throw error when username is valid', async () => {
                requestBody.username = 'demouser'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)

                const responseText = JSON.parse(data.text)

                expect(
                    responseText.description.find((context) =>
                        context.path.includes('username')
                    )
                ).toBeFalsy()
            })
        })
        describe('Should validate password', () => {
            test('Should throw error when passord is not given', async () => {
                requestBody.password = ''
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)

                expect(
                    responseText.description.find((context) =>
                        context.path.includes('password')
                    )
                ).toBeTruthy()
            })
            test('Should throw error when passord does not have at least 8 characters', async () => {
                requestBody.password = 'ab'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                const passwordEorrorContext = responseText.description.find(
                    (context) => context.path.includes('password')
                )

                expect(passwordEorrorContext).toBeTruthy()
                expect(passwordEorrorContext.message).toEqual(
                    'String must contain at least 8 character(s)'
                )
            })
            test('Should not throw error when passord is valid', async () => {
                requestBody.password = 'abcdefghijkl'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                const passwordEorrorContext = responseText.description.find(
                    (context) => context.path.includes('password')
                )
                expect(passwordEorrorContext).toBeFalsy()
            })
        })
        describe('Should validate confirmPassword', () => {
            test('Should throw error when confirmPassword is not given', async () => {
                requestBody.confirmPassword = ''
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                expect(
                    responseText.description.find((context) =>
                        context.path.includes('confirmPassword')
                    )
                ).toBeTruthy()
            })
            test('Should throw error when confirmPassword does not have at least 8 characters', async () => {
                requestBody.confirmPassword = 'ab'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                const passwordEorrorContext = responseText.description.find(
                    (context) => context.path.includes('confirmPassword')
                )

                expect(passwordEorrorContext).toBeTruthy()
                expect(passwordEorrorContext.message).toEqual(
                    'String must contain at least 8 character(s)'
                )
            })
            test('Should not throw error when confirmPassword is valid', async () => {
                requestBody.confirmPassword = 'lhkdmdkssdgd'

                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                const passwordEorrorContext = responseText.description.find(
                    (context) =>
                        context.message.includes(
                            'Password and confirm password must match'
                        )
                )
                expect(passwordEorrorContext).toBeTruthy()
            })
            test('Should not throw error when confirmPassword is valid', async () => {
                const createUserSpy = jest
                    .spyOn(userDB, 'createUser')
                    .mockResolvedValue(requestBody)
                const mailSpy = jest.spyOn(MailHelper, 'sendMailToUser')
                requestBody.confirmPassword = 'abcdefghijkl'
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                expect(createUserSpy).toHaveBeenCalled()
                expect(mailSpy).toHaveBeenCalled()
                expect(responseText.message).toEqual(
                    'Registration successful, please check email to verify your account'
                )
            })
        })
        describe('Creation validation', () => {
            test('Should create data without any error', async () => {
                const mailSpy = jest.spyOn(MailHelper, 'sendMailToUser')
                const data = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                const responseText = JSON.parse(data.text)
                expect(mailSpy).toHaveBeenCalled()
                expect(responseText.message).toEqual(
                    'Registration successful, please check email to verify your account'
                )
            })
            test('Should throw error when creating duplicate user', async () => {
                const mailSpy = jest.spyOn(MailHelper, 'sendMailToUser')
                const error = new Error('Duplicate data') as any
                error.code = 1100

                const createUserSpy = jest
                    .spyOn(userDB, 'createUser')
                    .mockRejectedValue(error)

                const retryResponse = await request(app)
                    .post('/auth/registration')
                    .send(requestBody)
                expect(mailSpy).toBeCalledTimes(0)
                expect(createUserSpy).toHaveBeenCalled()
                console.log(retryResponse)
            })
        })
    })
})
