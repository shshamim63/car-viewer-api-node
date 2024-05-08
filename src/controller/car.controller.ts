import { NextFunction, Request, Response } from 'express'

import * as carService from '../service/car.service'
import { formatResponse } from '../utils/formatResponse'

export const createCar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body
        const response = await carService.createCarRecord(body)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}
