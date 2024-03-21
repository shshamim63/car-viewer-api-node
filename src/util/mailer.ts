import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

import { mailerConfig } from '../config'
import { MailContext, MailConfirmation } from '../model/utils/mailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: mailerConfig.user,
        pass: mailerConfig.pass,
    },
})

const viewsPath = path.join(__dirname, '..', 'views')

transporter.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.join(viewsPath, 'partials'),
            defaultLayout: false,
        },
        viewPath: viewsPath,
    })
)

export const sendMailToUser = ({
    email,
    context,
    template = null,
}: {
    email: string
    context: MailContext
    template?: string
}): Promise<MailConfirmation> => {
    return new Promise((resolve, reject) => {
        const mailOption = {
            from: mailerConfig.user,
            to: email,
            subject: 'Activate your account',
            ...(template && { template: template }),
            context,
        }

        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
}
