import sgMail from '@sendgrid/mail';

import { appConfig, sendGridConfig } from '../config'

sgMail.setApiKey(sendGridConfig.sendgridApiKey)

export const sendConfirmationEmail = (name: string, email: string, activationToken: string) => {
    const msg = {
        to: email,
        from: 'shshamim63@gmail.com',
        templateId: 'd-1b4b3d65331540e2b06dd2dec960f1e2',
        dynamic_template_data: {
            customer: name,
            activation_url: `${appConfig.baseURL}/activate/user?token=${activationToken}`
        }
    }
    
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}