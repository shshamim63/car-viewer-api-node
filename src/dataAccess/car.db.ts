import { ICarBrandRequestBody, ICarRequestBody } from '../model/car/cars.model'
import { Car, CarBrand } from '../model/car/cars.mongo.schema'

export const createCarBrand = async (
    data: ICarBrandRequestBody
): Promise<ICarBrandRequestBody> => {
    const savedCarBrand = await CarBrand.create(data)
    return savedCarBrand
}

export const createCar = async (
    data: ICarRequestBody
): Promise<ICarRequestBody> => {
    const savedCar = await Car.create(data)
    return savedCar
}
