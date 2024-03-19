import nodemailer from 'nodemailer'
import { sendMailToUser } from '../../src/util/mailer'

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn((options, callback) => {
            callback(null, { message: 'Email sent successfully' })
        }),
        use: jest.fn(),
    }),
}))

describe('sendMailToUser function', () => {
    it('should send an email successfully', async () => {
        const email = 'test@example.com'
        const context = {
            name: 'John Doe',
            activationLink: 'http://example.com/activate',
        }

        const result = await sendMailToUser({ email, context })
        expect(result).toBeTruthy()
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1)
    })
})
