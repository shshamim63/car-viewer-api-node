import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import { connectDB } from './config/mongoDB'

import * as defaultRoutes from './routes/default'
import * as carRouters from './routes/cars'
import * as authRoutes from './routes/auth'

import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware'
import { invalidRouteMiddleware } from './middlewares/invalidRoute.middleware'
import { corsMiddleware } from './middlewares/cors.middleware'

connectDB()

const app = express()
const swaggerDocument = YAML.load('./swagger/staging.yaml')
const options = {
    explorer: true,
}

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json())

app.use(corsMiddleware)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use(defaultRoutes.router)
app.use(authRoutes.router)
app.use(carRouters.router)
app.use(invalidRouteMiddleware)

app.use(errorHandlerMiddleware)

export { app }
