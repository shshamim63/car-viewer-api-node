import mongoose, { ConnectOptions } from 'mongoose'
import { mongoConfig } from '../src/config'
import { logger } from '../src/util/logger'

beforeAll(async () => {
    await mongoose.connect(mongoConfig.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await logger.close()
})
