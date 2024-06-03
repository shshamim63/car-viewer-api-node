import cors from 'cors'
import { CORS_ERROR_MESSAGE } from '../const/error'

const allowedOrigins = ['http://localhost:5173']

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error(CORS_ERROR_MESSAGE), false)
        }

        return callback(null, true)
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}

export const corsMiddleware = cors(corsOptions)
