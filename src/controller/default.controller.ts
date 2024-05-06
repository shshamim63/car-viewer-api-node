import { Request, Response } from 'express'
import client from 'prom-client'

export const root = (req: Request, res: Response) => {
    res.send({
        message: 'App server is running successfully',
    })
}

export const metrics = async (req: Request, res: Response) => {
    res.setHeader('Context-Type', client.register.contentType)
    const metrics = await client.register.metrics()
    res.send(metrics)
}
