import { appConfig } from './config'
import { app } from './app'
import { mongoConnect } from './config/mongoDB'

const port = appConfig.port || 3001

app.listen(port, async () => {
    if (process.env.NODE_ENV !== 'test')
    {
        console.log("Hello")
        await mongoConnect()
    }
    console.log(`Express is listening at http://localhost:${port}`)
})
