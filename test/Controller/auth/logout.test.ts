import request from 'supertest'
import { faker } from '@faker-js/faker'

import { app } from '../../../src/app'

describe('Auth/Login', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    describe('Token validation', () => {
        test('Should throw error when request header missing token', async () => {
            const response = await request(app).post('/auth/logout')
            console.log('Response', response.text)
        })
    })
})
