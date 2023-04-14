import sgMail from '@sendgrid/mail';

import { appConfig, sendGridConfig } from '../config'

sgMail.setApiKey(sendGridConfig.sendgridApiKey)

export const sendConfirmationEmail = (name: string, email: string, activationToken: string) => {

    const activationUrl = `${appConfig.baseURL}/activate/user?token=${activationToken}`

    if(appConfig.env === 'development') console.log("Active Token, ")

    const msg = {
        to: email,
        from: sendGridConfig.sendgridSenderEmail,
        templateId: 'd-1b4b3d65331540e2b06dd2dec960f1e2',
        dynamic_template_data: {
            customer: name,
            activation_url: activationUrl 
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