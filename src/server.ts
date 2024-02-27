import { appConfig } from './config'
import { app } from './app'

const port = appConfig.port || 3001

app.listen(port, async () => {
    console.log(`Express is listening at port ${port}`)
})
