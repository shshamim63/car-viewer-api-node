export const appConfig = {
    port: process.env.PORT,
}

export const authConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}

export const mongoConfig = {
    mongoURL: process.env.MONGO_URI,
}
