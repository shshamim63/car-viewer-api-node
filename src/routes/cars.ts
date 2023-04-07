import { Router } from 'express'
import * as carController from '../controller/car.controller'

const router = Router()

router.post('/cars', carController.createCarRecord)

export { router }
