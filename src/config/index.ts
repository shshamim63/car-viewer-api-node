import dotenv from 'dotenv'
dotenv.config()

export const appConfig = {
    port: process.env.PORT,
    baseURL: process.env.BASE_URL,
    env: process.env.NODE_ENV,
}

export const authConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}

export const mongoConfig = {
    mongoURL: process.env.MONGO_URI,
}

export const sendGridConfig = {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    sendgridSenderEmail: process.env.SENDGRID_SENDER_EMAIL,
}
