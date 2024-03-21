import mongoose, { ConnectOptions } from 'mongoose'

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

const connectDB = async () => {
    try {
        console.log(connectionURL)
        const conn = await mongoose.connect(connectionURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(`Error: ${err.message}`)
        process.exit(1)
    }
}

export { connectDB, mongoose }
