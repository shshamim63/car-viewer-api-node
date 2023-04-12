import request from 'supertest'
import { app } from '../../../src/app'
import { IAuthenticatedUser, ILoginBody, IRegistrationBody } from '../../../src/model/user/user.model'
import { registerUser } from '../../../src/service/auth.service'
import { User } from '../../../src/model/user/user.mongo.schema'

describe('auth/login', () => {
    let authenticateUser: IAuthenticatedUser
    let userData: IRegistrationBody
    
    beforeAll( async ()=> {
        userData = {
            email: 'demo15@gmail.com',
            username: 'demo123',
            password: '123456789',
            confirmPassword: '123456789',
        }
        authenticateUser = await registerUser(userData)
    })
    
    afterAll(async ()=> {
        await User.deleteOne({_id: authenticateUser.id})
    })
    describe('Validate login credentials', () => {
        const loginRequestBody: ILoginBody = {}
        test('It should throw error when request body does not contain any property', async () => {
            const response = await request(app).post('/user/login').send(loginRequestBody)
            expect(response.error.status).toEqual(400)
            expect(response._body.message).toEqual('Invalid Schema')
            expect(
                response._body.description.find((message) =>
                    message.path.includes('email')
                ).message
            ).toEqual('Required')
            expect(
                response._body.description.find((message) =>
                    message.path.includes('password')
                ).message
            ).toEqual('Required')
        })

        test('It should throw error when user with email does not exist', async () => {
            loginRequestBody['email'] = 'demo@gmail.com'
            loginRequestBody['password'] = '123456789'
            const response = await request(app).post('/user/login').send(loginRequestBody)
            expect(response.error.status).toEqual(404)
            expect(response._body.message).toEqual('Invalid user credential')
            expect(response._body.description).toEqual(`User does not exist with email: ${loginRequestBody.email}`)
        })

        test('It should throw error when password is invalid', async () => {
            loginRequestBody['email'] = userData.email
            loginRequestBody['password'] = '987654123'
            const response = await request(app).post('/user/login').send(loginRequestBody)
            expect(response.error.status).toEqual(401)
            expect(response._body.message).toEqual('Invalid user credential')
            expect(response._body.description).toEqual(`Invalid password`)
        })

        test('It should return success response when receive valid credential', async () => {
            loginRequestBody['email'] = userData.email
            loginRequestBody['password'] = userData.password
            const response = await request(app).post('/user/login').send(loginRequestBody)
            expect(response.status).toEqual(200)
        })
    })
})