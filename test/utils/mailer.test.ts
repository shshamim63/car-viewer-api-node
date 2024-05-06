import nodemailer from 'nodemailer'
import { sendMailToUser } from '../../src/utils/mailer'

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn((options, callback) => {
            callback(null, { message: 'Email sent successfully' })
        }),
        use: jest.fn(),
    }),
}))

describe('sendMailToUser()', () => {
    it('Function should send an object containing successfull message', async () => {
        const email = 'test@example.com'
        const context = {
            name: 'John Doe',
            activationLink: 'http://example.com/activate',
        }

        const result = await sendMailToUser({ email, context })
        expect(result).toMatchObject({
            message: expect.any(String),
        })
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1)
    })
})
