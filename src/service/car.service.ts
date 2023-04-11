import { dbFirestore } from '../config/firebaseDB'
import { CarRef } from '../config/firebaseDB'
import { Car } from '../model/car/cars.model'
import { AppError } from '../middlewares/appError'

export const createCarRecord = async (body: Car): Promise<string> => {
    try {
        await CarRef.doc().set({
            ...body,
            created_at: dbFirestore.FieldValue.serverTimestamp(),
        })
        return 'Created Car Record SuccessFully'
    } catch (error) {
        throw new AppError(500, 'Server error')
    }
}
