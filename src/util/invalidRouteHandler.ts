import { NextFunction, Response, Request } from "express";
import { AppError } from "./appError";

export const invalidRouteHandler = (req: Request, res: Response, next: NextFunction) => {
  next({statusCode: 500, message: 'Invalid URL'});
}