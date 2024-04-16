import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'
import * as authService from '../../../src/service/auth.service'
import * as userDB from '../../../src/dataAccess/user.db'
import { IAuthenticatedUser } from '../../../src/model/user/user.model'

describe('Auth/Login', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    const requestBody = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    const responseUser = {
        email: requestBody.email,
        status: 'Pending',
        avatar: faker.image.avatar(),
        createdAt: new Date(),
        id: faker.database.mongodbObjectId(),
        profileId: faker.database.mongodbObjectId(),
        role: 'user',
        updatedAt: new Date(),
        username: faker.internet.userName(),
        accessToken: faker.string.hexadecimal({
            length: 64,
        }),
        refreshToken: faker.string.hexadecimal({
            length: 64,
        }),
        authorizationType: 'Bearer',
    }
    describe('Request body validation', () => {
        test('Should throw error when request body does not contain any property', async () => {
            const response = await request(app).post('/auth/login')
            const reponseObject = JSON.parse(response.text)
            expect(reponseObject.message).toEqual('Invalid Schema')
            expect(
                reponseObject.description.find((context) =>
                    context.path.includes('email')
                )
            )
            expect(
                reponseObject.description.find((context) =>
                    context.path.includes('password')
                )
            )
            expect(response.status).toEqual(400)
        })
        test('Should throw error when request body does not contain any property', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ ...requestBody, email: 'demo@gmailcom' })
            const reponseObject = JSON.parse(response.text)
            expect(reponseObject.message).toEqual('Invalid Schema')
            expect(
                reponseObject.description.find((context) =>
                    context.path.includes('email')
                )
            )
            expect(response.status).toEqual(400)
        })
        test('Should throw error when request body does not contain any property', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ ...requestBody, password: '' })
            const reponseObject = JSON.parse(response.text)
            expect(reponseObject.message).toEqual('Invalid Schema')
            expect(
                reponseObject.description.find((context) =>
                    context.path.includes('email')
                )
            )
            expect(response.status).toEqual(400)
        })
        test('Should not throw error when request body contains the right data', async () => {
            jest.spyOn(authService, 'login').mockImplementation(
                () =>
                    Promise.resolve(responseUser) as Promise<IAuthenticatedUser>
            )

            const response = await request(app)
                .post('/auth/login')
                .send(requestBody)
            expect(response.status).toEqual(200)
        })
    })
    describe('Login flow', () => {
        test('Should throw error when user does not exist', async () => {
            jest.spyOn(userDB, 'findOneUser').mockImplementation(() => {
                return null
            })
            const response = await request(app)
                .post('/auth/login')
                .send(requestBody)
            expect(response.status).toEqual(404)
        })
    })
})
