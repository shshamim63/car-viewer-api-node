import { Types } from 'mongoose'

import { AppError } from '../utils/appError'
import { RESPONSE_MESSAGE, STATUS_CODES } from '../const/error'

import * as carDB from '../repositories/car.repository'
import { CarRequestBody, MongoCar } from '../interfaces/car.interface'
import { User } from '../interfaces/user.interface'

export const createCar = async (
    carInfo: CarRequestBody,
    user: User
): Promise<MongoCar> => {
    try {
        const userObjectId = new Types.ObjectId(user.id)
        const data = {
            ...carInfo,
            created_by: userObjectId,
            last_modified_by: userObjectId,
        }
        const car = await carDB.createCar(data)
        return car
    } catch (error) {
        throw new AppError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
        )
    }
}
