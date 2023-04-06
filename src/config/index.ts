import * as dotenv from 'dotenv'
dotenv.config()

export const appConfig = {
    port: process.env.PORT,
}

export const mongoConfig = {
    mongoURL: process.env.MONGO_URI
}