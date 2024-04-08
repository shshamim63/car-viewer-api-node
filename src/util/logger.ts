import { createLogger, transports } from 'winston'
import LokiTransport from 'winston-loki'

export const logger = createLogger({
    transports: [
        new transports.Console(),
        new LokiTransport({
            labels: { appName: 'express' },
            host: 'http://loki:3100',
        }),
    ],
})
