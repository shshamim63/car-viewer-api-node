import { Request, Response, NextFunction} from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if(err.description && err.statusCode === 400) {
    res.send({
      message: err.message,
      description: err.description
    }).status(err.statusCode)
  } else {
    res.send({
      message: 'Unknown Error'
    })
  }
}