import { Router } from 'express'
import * as authController from '../controller/auth.controller'

const router = Router()

router.post('/auth/user/activate', authController.activateUserAccount)
router.post('/auth/refresh/token', authController.refreshToken)
router.post('/auth/login', authController.login)
router.post('/auth/registration', authController.registerUser)
router.post('/auth/logout', authController.logout)

export { router }
