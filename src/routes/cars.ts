import { Router } from 'express'
import * as carController from "../controller/carController";

const router = Router()

router.post('/cars', carController.createCarRecord)

export { router }
