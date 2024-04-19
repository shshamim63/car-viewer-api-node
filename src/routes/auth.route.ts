import { Router } from 'express'
import * as authController from '../controller/auth.controller'
import { validation } from '../middlewares/validation.middleware'
import { loginSchema, signupSchema } from '../validators/auth.validator'

const router = Router()

// router.post('/auth/user/activate', authController.activateUserAccount)
// router.post('/auth/refresh/token', authController.refreshToken)
router.post('/auth/login', validation(loginSchema), authController.login)
router.post(
    '/auth/registration',
    validation(signupSchema),
    authController.registerUser
)
// router.post('/auth/logout', authController.logout)

export { router }
