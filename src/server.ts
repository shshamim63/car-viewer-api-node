import { appConfig } from './config'
import { app } from './app'

const port = appConfig.port || 3001

app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`)
})
