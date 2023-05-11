import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

require('./config/mongoDB')

import * as defaultRoutes from './routes/default'
import * as carRouters from './routes/cars'
import * as authRoutes from './routes/auth'
import { errorHandler } from './middlewares/errorHandler'
import { invalidRouteHandler } from './middlewares/invalidRouteHandler'

const app = express()

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json())

const swaggerDocument = YAML.load('./swagger/staging.yaml')

const options = {
    explorer: true,
}

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
app.use(defaultRoutes.router)
app.use(authRoutes.router)
app.use(carRouters.router)
app.use(invalidRouteHandler)

app.use(errorHandler)

export { app }
