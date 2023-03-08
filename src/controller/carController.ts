import { Request, Response } from 'express'

export const createCarRecord = (req: Request, res: Response) => {
    res.send({
        message: 'App server is running successfully',
    })
}
