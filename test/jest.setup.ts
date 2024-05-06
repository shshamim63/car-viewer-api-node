import mongoose, { ConnectOptions } from 'mongoose'
import { mongoConfig } from '../src/config'

jest.mock('../src/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}))

beforeAll(async () => {
    await mongoose.connect(mongoConfig.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})
