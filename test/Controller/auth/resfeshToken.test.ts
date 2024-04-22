// import request from 'supertest'
// import { faker } from '@faker-js/faker'

// import { app } from '../../../src/app'
// import * as authService from '../../../src/service/auth.service'
// import { generateAccessInfoMockResponse } from '../../data/user'

// describe('Auth/User/Activation', () => {
//     afterEach(() => {
//         jest.clearAllMocks()
//         jest.resetAllMocks()
//         jest.restoreAllMocks()
//     })
//     const token = faker.string.hexadecimal({ length: 64 })
//     describe('Request Header validation', () => {
//         test('Should thorw error when header does not contain token', async () => {
//             const response = await request(app).post('/auth/refresh/token')
//             expect(response.status).toEqual(400)
//             expect(
//                 JSON.parse(response.text).description.find((context) =>
//                     context.path.includes('token')
//                 )
//             ).toBeTruthy()
//         })
//         test('Should not throw validation error when header contains token', async () => {
//             // jest.spyOn(authService, 'refreshToken').mockResolvedValue(
//             //     generateAccessInfoMockResponse()
//             // )
//             const response = await request(app)
//                 .post('/auth/refresh/token')
//                 .set('token', token)
//             expect(response.status).toEqual(200)
//             expect(JSON.parse(response.text).data.accessToken).toBeTruthy()
//             expect(authService.refreshToken).toHaveBeenCalled()
//         })
//     })
//     describe('Refresh token success', () => {
//         test('Should provide new token when user is present', async () => {
//             const response = await request(app)
//                 .post('/auth/refresh/token')
//                 .set('token', token)
//             expect(response.status).toEqual(200)
//             expect(JSON.parse(response.text).data.accessToken).toBeTruthy()
//         })
//     })
// })
