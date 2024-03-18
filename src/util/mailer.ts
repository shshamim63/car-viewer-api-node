import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

import { mailerConfig } from '../config'
import { MailContext } from '../model/utils/mailer'

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

export const sendMail = ({
    email,
    context,
    template = null,
}: {
    email: string
    context: MailContext
    template?: string
}) => {
    const mailOption = {
        from: mailerConfig.user,
        to: email,
        subject: 'Activate your account',
        ...(template && { template: template }),
        context,
    }

    transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Email sent', info)
        }
    })
}
