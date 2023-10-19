import { ConnectOptions, connect } from 'mongoose'

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

console.log('Mongo URL', connectionURL)

connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Failed to connect MongoDB'))
