import { appConfig } from './config'
import { app } from './app'
import { logger } from './utils/logger'

const port = appConfig.port || 3001

app.listen(port, async () => {
    logger.info(`Express is listening at port ${port}`)
})
