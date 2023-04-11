import request from 'supertest'
import { app } from '../../src/app'

import { IRegistrationBody } from '../../src/model/user/user.model'
import { AppError } from '../../src/middlewares/appError'
import { object } from 'zod'

describe('Auth', () => {
    describe('Registration Flow', () => {
        const requestBody = {} as IRegistrationBody
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
    })
})
