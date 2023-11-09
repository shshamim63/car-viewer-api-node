import { NextFunction, Request, Response } from 'express'

import { schemaValidation } from '../helper/schemaValidation'

import * as carService from '../service/car.service'
import { formatResponse } from '../helper/formatResponse.helper'

import {
    CarBrandRequestBodySchema,
    CarRequestBodySchema,
} from '../model/car/cars.schema'

export const createCarRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = schemaValidation(CarRequestBodySchema, req.body)
        const response = await carService.createCarRecord(body)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}

export const createCarBrandRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = schemaValidation(CarBrandRequestBodySchema, req.body)
        const response = await carService.createCarRecord(body)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}
