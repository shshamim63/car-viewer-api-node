import mongoose, { ConnectOptions } from 'mongoose'

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

console.log("Mongo URL", connectionURL)

mongoose
    .connect(connectionURL, {
        useNewUrlParser: true,
    } as ConnectOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Failed to connect MongoDB'))
