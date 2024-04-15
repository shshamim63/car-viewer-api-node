import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { mongoConfig } from '../../../src/config'
import { app } from '../../../src/app'
import * as authService from '../../../src/service/auth.service'
import * as userDB from '../../../src/dataAccess/user.db'
import { IAuthenticatedUser } from '../../../src/model/user/user.model'

describe('Auth/Login', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoConfig.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })
    describe('Token validation', () => {
      test('Should throw error when request header missing token', async () => {
        await request(app).post('/auth/logout')
      })
    })
})
