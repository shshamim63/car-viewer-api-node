import { Router } from 'express'
import * as authController from '../controller/auth.controller'

const router = Router()

router.get('/activate/user', authController.activateUserAccount)
router.post('/user/login', authController.login)
router.post('/user/registration', authController.registerUser)

export { router }
