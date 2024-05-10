import { MongoCar, NewCar } from '../interfaces/car.interface'
import { Car } from '../model/car.model'
import { AppError } from '../utils/appError'

export const createCar = async (data: NewCar): Promise<MongoCar> => {
    try {
        const newCar = await Car.create(data)
        return newCar.toObject()
    } catch (error) {
        throw new AppError(500, 'Server error', error)
    }
}
