export const appConfig = {
    port: process.env.PORT,
    baseURL: process.env.BASE_URL
}

export const authConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}

export const mongoConfig = {
    mongoURL: process.env.MONGO_URI,
}

export const sendGridConfig = {
    sendgridApiKey:  process.env.SENDGRID_API_KEY
}