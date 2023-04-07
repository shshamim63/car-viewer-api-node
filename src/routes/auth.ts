import { Router } from 'express'
import * as authController from "../controller/auth.controller";

const router = Router()

router.post('/user/registration', authController.registerUser)

export { router }