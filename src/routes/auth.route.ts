import { Router } from 'express'
import * as authController from '../controller/auth.controller'
import { validation } from '../middlewares/validation.middleware'
import {
    loginSchema,
    signupSchema,
    refreshTokenSchema,
    activateAccountQuerySchema,
} from '../validators/auth.validator'

const router = Router()

router.post(
    '/auth/user/activate',
    validation(activateAccountQuerySchema, 'path'),
    authController.activateAccount
)
router.post(
    '/auth/refresh/token',
    validation(refreshTokenSchema, 'header'),
    authController.refreshToken
)

router.post('/auth/login', validation(loginSchema), authController.login)
router.post(
    '/auth/registration',
    validation(signupSchema),
    authController.registerUser
)
router.post(
    '/auth/logout',
    validation(refreshTokenSchema, 'header'),
    authController.logout
)

export { router }
