import bcrypt from 'bcrypt'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

import * as userDB from '../../../src/dataAccess/user.repository'

import {
    generateLoginCredentials,
    invalidSchemaMessage,
    mongodUser,
} from '../../data/user.data'

describe('Auth/Login', () => {
    let findUserSpy
    let bcryptSpy
    beforeEach(() => {
        findUserSpy = jest
            .spyOn(userDB, 'findOneUser')
            .mockResolvedValue(mongodUser())
        bcryptSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true)
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

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
        describe('Validation/email', () => {
            const loginCredentials = generateLoginCredentials()
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
            test('Response should have code 400 when email is invalid', async () => {
                const response = await request(app)
                    .post('/auth/login')
                    .send(loginCredentials)
                const { status, body } = response
                console.log(body)
                expect(status).toEqual(200)
            })
        })
    })
})
