import request from 'supertest'
import { app } from '../../src/app'

describe('Test the root path', () => {
    test('Response should contain 200 status code with the message App server is running successfully', async () => {
        const response = await request(app).get('/')
        const {
            status,
            body: { message },
        } = response
        expect(status).toBe(200)
        expect(typeof message).toBe('string')
    })
})
