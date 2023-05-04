import mongoose, { ConnectOptions } from 'mongoose';

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

export const mongoConnect = async () => {
    mongoose.connect(connectionURL, {
        useNewUrlParser: true,
    } as ConnectOptions).then(() => { console.log('Connected To database :)')})
    .catch( err => console.log('error', err))
}