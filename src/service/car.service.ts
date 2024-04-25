import { ICarBrandRequestBody, ICarRequestBody } from '../model/car/cars.model'
import { AppError } from '../util/appError'

import * as carDB from '../repositories/carRepository'

export const createCarRecord = async (
    body: ICarRequestBody
): Promise<string> => {
    try {
        await carDB.createCar(body)
        return 'Created Car Record SuccessFully'
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}

export const createCarBrandRecord = async (
    body: ICarBrandRequestBody
): Promise<string> => {
    try {
        await carDB.createCarBrand(body)
        return 'Created Car Brand Record SuccessFully'
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}
