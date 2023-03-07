import * as dotenv from 'dotenv'
dotenv.config()

export const appConfig = {
    port: process.env.PORT,
}
