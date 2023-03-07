import express from 'express'
import bodyParser from 'body-parser'
import winston from 'winston'
import expressWinston from 'express-winston'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'



import * as defaultRoutes from './routes/default'

const app = express()

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json())

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
        meta: true, 
        msg: 'HTTP {{req.method}} {{req.url}}',
        expressFormat: true,
        colorize: false,
        ignoreRoute: function (_req, _res) {
            return false
        },
    })
)

const swaggerDocument = YAML.load('./swagger/staging.yaml')

const options = {
    explorer: true,
}

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
app.use(defaultRoutes.router)

export { app }