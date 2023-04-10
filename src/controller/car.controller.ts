import { NextFunction, Request, Response } from 'express'
import { CarSchema } from '../schema/car/cars.schema'
import { schemaValidation } from '../util/schemaValidation'

import * as carService from '../service/car.service'
import { Car } from '../model/cars.model'
import { formatResponse } from '../util/formatResponse'

export const createCarRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = schemaValidation(CarSchema, req.body) as unknown as Car
        const response = await carService.createCarRecord(body)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}
