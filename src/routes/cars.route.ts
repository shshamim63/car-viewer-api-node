import { Router } from 'express'

import * as validation from '../middlewares/validation.middleware'
import { isAuthenticated } from '../middlewares/authentication.middleware'
import { hasAuthorization } from '../middlewares/authorization.middleware'

import * as carController from '../controller/car.controller'
import { CarRequestBodySchema } from '../validators/car.validator'

const router = Router()

router.post(
    '/cars',
    isAuthenticated,
    hasAuthorization,
    validation.bodyValidation(CarRequestBodySchema),
    carController.createCar
)

export { router }
