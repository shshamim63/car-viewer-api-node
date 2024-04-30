import { Router } from 'express'
import * as authController from '../controller/auth.controller'
import * as validation from '../middlewares/validation.middleware'
import {
    loginSchema,
    signupSchema,
    refreshTokenSchema,
    activateAccountQuerySchema,
} from '../validators/auth.validator'

const router = Router()

router.post(
    '/auth/user/activate',
    validation.queryValidation(activateAccountQuerySchema),
    authController.activateAccount
)
router.post(
    '/auth/refresh/token',
    validation.headersValidation(refreshTokenSchema),
    authController.refreshToken
)

router.post(
    '/auth/login',
    validation.bodyValidation(loginSchema),
    authController.login
)
router.post(
    '/auth/registration',
    validation.bodyValidation(signupSchema),
    authController.registerUser
)
router.post(
    '/auth/logout',
    validation.headersValidation(refreshTokenSchema),
    authController.logout
)

export { router }
