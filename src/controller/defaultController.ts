import { Request, Response } from "express"

export const root = (req: Request, res: Response) => {
  console.log('Hello')
  res.send({
    message: 'App server is running successfully'
  })
}
