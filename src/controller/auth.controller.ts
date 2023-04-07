import { NextFunction, Request, Response } from 'express'

import * as authService from '../service/auth.service'
import { schemaValidation } from '../util/schemaValidation'
import { formatResponse } from '../util/formatResponse'

import {
    LoginBodySchema,
    RegistrationBodySchema,
} from '../schema/user/user.schema'
import { ILoginBody, IRegistrationBody } from '../model/user.model'

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestBody: ILoginBody = req.body
        const body = schemaValidation(LoginBodySchema, requestBody)
        console.log('Body', body)
        const response = await authService.login(body)
        if (response) res.send(formatResponse(response)).status(200)
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestBody: IRegistrationBody = req.body
        const body = schemaValidation(RegistrationBodySchema, requestBody)
        const response = await authService.registerUser(body)
        if (response) res.send(formatResponse(response)).status(200)
    } catch (error) {
        next(error)
    }
}
