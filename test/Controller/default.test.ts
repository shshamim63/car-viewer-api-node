import mongoose, { ConnectOptions } from 'mongoose'
import request from 'supertest'
import { app } from '../../src/app'
import { mongoConfig } from '../../src/config'

describe('Test the root path', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoConfig.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
    test('It should response the GET method', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response._body.message).toEqual(
            'App server is running successfully'
        )
    })
})
