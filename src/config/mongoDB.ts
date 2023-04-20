import { ConnectOptions, connect } from 'mongoose'

import { mongoConfig } from '.'

const connectionURL = mongoConfig.mongoURL

export const mongoConnect = async () => {
    try {
        await connect(connectionURL, { useNewUrlParser: true } as ConnectOptions)
      } catch (error) {
        console.log('error', error)
      }
}
