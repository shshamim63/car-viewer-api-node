import { Router } from 'express'
import * as carController from '../controller/car.controller'
import {
    authenticate,
    authorized,
} from '../middlewares/authenticate.middleware'

const router = Router()

router.post(
    '/cars/brand',
    authenticate,
    authorized,
    carController.createCarBrandRecord
)
router.post('/cars', authenticate, authorized, carController.createCarRecord)

export { router }
