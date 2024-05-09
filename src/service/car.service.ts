import { AppError } from '../utils/appError'

import * as carDB from '../repositories/carRepository'

export const createCarRecord = async (body): Promise<string> => {
    try {
        await carDB.createCar(body)
        return 'Created Car Record SuccessFully'
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}

// export const createCarBrandRecord = async (body): Promise<string> => {
//     try {
//         await carDB.createCarBrand(body)
//         return 'Created Car Brand Record SuccessFully'
//     } catch (error) {
//         throw new AppError(500, 'Server error')
//     }
// }
