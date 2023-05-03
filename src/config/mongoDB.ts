import mongoose, { ConnectOptions } from 'mongoose';

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
} as ConnectOptions).then(() => { console.log('Connected To database :)')})
.catch( err => console.log('error', err));

module.exports = mongoose