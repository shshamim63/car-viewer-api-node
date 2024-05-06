import request from 'supertest'
import { app } from '../../src/app'

describe('Test the root path', () => {
    test('Response should contain 200 status code with the message App server is running successfully', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response._body.message).toEqual(
            'App server is running successfully'
        )
    })
})
