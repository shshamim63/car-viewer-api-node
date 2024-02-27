import { ConnectOptions, connect } from 'mongoose'

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Failed to connect MongoDB'))
