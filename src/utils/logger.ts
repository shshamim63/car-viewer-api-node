import { createLogger, transports } from 'winston'
import LokiTransport from 'winston-loki'
import { lokiConfig } from '../config'

export const logger = createLogger({
    transports: [
        new transports.Console(),
        new LokiTransport({
            labels: { appName: 'express' },
            host: lokiConfig.URL,
        }),
    ],
})
