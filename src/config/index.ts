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

const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_DATABASE,
} = process.env

export const mongoConfig = {
    mongoURL: `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=admin`,
}
