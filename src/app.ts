import express from 'express'

import { appConfig } from './config'

import * as defaultRoutes from "./routes/default"

const app = express()

app.use(defaultRoutes.router)

const port = appConfig.port || 3001

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})