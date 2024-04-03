import express from 'express'
import bodyParser from 'body-parser'
import client from 'prom-client'
import responseTime from 'response-time'
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

const collectDefaultMetrics = client.collectDefaultMetrics

collectDefaultMetrics({
    register: client.register,
})

const reqResTime = new client.Histogram({
    name: 'http_express_req_time',
    help: 'this tells how much time is taken by req and res',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
})

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

app.use(
    responseTime((req, res, time) => {
        reqResTime
            .labels({
                method: req.method,
                route: req.url,
                status_code: res.statusCode,
            })
            .observe(time)
    })
)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use(defaultRoutes.router)
app.use(authRoutes.router)
app.use(carRouters.router)

app.use(invalidRouteMiddleware)
app.use(errorHandlerMiddleware)

export { app }
