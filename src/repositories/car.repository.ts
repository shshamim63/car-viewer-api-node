import { AppError } from '../utils/appError'
import { RESPONSE_MESSAGE, STATUS_CODES } from '../const/error'

import { MongoCar, NewCar } from '../interfaces/car.interface'
import { Car } from '../model/car.model'

export const createCar = async (data: NewCar): Promise<MongoCar> => {
    try {
        const newCar = await Car.create(data)
        return newCar.toObject()
    } catch (error) {
        throw new AppError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
            error
        )
    }
}
