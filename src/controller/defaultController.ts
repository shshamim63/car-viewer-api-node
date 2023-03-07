import { Request, Response } from 'express'

export const root = (req: Request, res: Response) => {
    res.send({
        message: 'App server is running successfully',
    })
}
