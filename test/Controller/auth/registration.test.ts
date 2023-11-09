import request from 'supertest'
import { app } from '../../../src/app'

import * as authService from '../../../src/service/auth.service'

import { IRegistrationBody } from '../../../src/model/user/user.model'
import { AppError } from '../../../src/util/appError'

describe('Auth/Registration', () => {
    const requestBody = {} as IRegistrationBody
    describe('Registration Flow', () => {
        test('It should throw error, when empty request body is provided', async () => {
            const response = await request(app)
                .post('/user/registration')
                .send(requestBody)
            expect(response.error.status).toEqual(400)
            expect(response._body.message).toEqual('Invalid Schema')
        })
        describe('Validate Email as input', () => {
            test('It should throw error, when email is not valid', async () => {
                requestBody['email'] = 'demo@'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response.error.status).toEqual(400)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find(
                        (message) => message.validation === 'email'
                    ).message
                ).toEqual('Invalid email')
            })

            test('It should not throw error, when email is valid', async () => {
                requestBody['email'] = 'demo@gmail.com'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find(
                        (message) => message.validation === 'email'
                    )
                ).toEqual(undefined)
            })
        })

        describe('Validate Username as input', () => {
            test('It should throw error, when username is not string', async () => {
                requestBody['username'] = 15 as unknown as string
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response.error.status).toEqual(400)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find((message) =>
                        message.path.includes('username')
                    ).message
                ).toEqual('Expected string, received number')
            })

            test('It should throw error, when length of username is less than 6', async () => {
                requestBody['username'] = 'demo'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response.error.status).toEqual(400)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find((message) =>
                        message.path.includes('username')
                    ).message
                ).toEqual('String must contain at least 6 character(s)')
            })

            test('It should not throw error, when length of username is grater than 6 and is a string', async () => {
                requestBody['username'] = 'demo121'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find((message) =>
                        message.path.includes('username')
                    )
                ).toEqual(undefined)
            })
        })
        describe('Validate password and confirmPassword', () => {
            test('It should throw error when password length is less than 8', async () => {
                requestBody['password'] = '1234'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response.error.status).toEqual(400)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(
                    response._body.description.find((message) =>
                        message.path.includes('password')
                    ).message
                ).toEqual('String must contain at least 8 character(s)')
            })

            test('It should throw error when confirmPassword length is less than 8', async () => {
                requestBody['confirmPassword'] = '1234'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(response.error.status).toEqual(400)
                expect(
                    response._body.description.find((message) =>
                        message.path.includes('confirmPassword')
                    ).message
                ).toEqual('String must contain at least 8 character(s)')
            })

            test('It should throw error when password and confirm password are not equal', async () => {
                requestBody['password'] = '123456789'
                requestBody['confirmPassword'] = '987654321'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(response._body.message).toEqual('Invalid Schema')
                expect(response.error.status).toEqual(400)
                expect(
                    response._body.description.find(
                        (message) =>
                            message.message ===
                            'Password and confirm password must match'
                    ).message
                ).toEqual('Password and confirm password must match')
            })
        })
        describe('It should register a new user', () => {
            test('When all the field contains valid data should create a new user', async () => {
                const registerUserMock = jest
                    .spyOn(authService, 'registerUser')
                    .mockResolvedValue(
                        'User was registered successfully! Please check your email'
                    )
                requestBody['password'] = '123456789'
                requestBody['confirmPassword'] = '123456789'
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(registerUserMock).toHaveBeenCalled()
                expect(response.status).toEqual(201)
            })

            test('It should throw error while creating duplicate user', async () => {
                const registerUserMock = jest
                    .spyOn(authService, 'registerUser')
                    .mockImplementation(() => {
                        throw new AppError(
                            409,
                            'User already exists with the following',
                            { email: requestBody.email }
                        )
                    })
                const response = await request(app)
                    .post('/user/registration')
                    .send(requestBody)
                expect(registerUserMock).toHaveBeenCalled()
                expect(response.error.status).toEqual(409)
            })
        })
    })
})
