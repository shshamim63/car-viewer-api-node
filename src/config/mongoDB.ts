import { ConnectOptions, connect } from "mongoose";

import { mongoConfig } from ".";

const connectionURL = mongoConfig.mongoURL

export const mongoConnect = () => {
    connect(connectionURL, { useNewUrlParser: true } as ConnectOptions).then(() => { console.log('Connected To database :)')})
    .catch( err => console.log('error', err))
}