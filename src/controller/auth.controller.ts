import { NextFunction, Request, Response } from 'express'

import { schemaValidation } from '../util/schemaValidation'
import { formatResponse } from '../util/formatResponse'

import * as authService from '../service/auth.service'

import {
    ActivateUserQuerySchema,
    LoginBodySchema,
    RegistrationBodySchema,
} from '../model/user/user.schema'
import {
    IActivateUserQuery,
    ILoginBody,
    IRegistrationBody,
} from '../model/user/user.model'

export const activateUserAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestQuery: IActivateUserQuery = req.query
        const data = schemaValidation(ActivateUserQuerySchema, requestQuery)
        const response = await authService.activateUserAccount(data)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestBody: ILoginBody = req.body
        const body = schemaValidation(LoginBodySchema, requestBody)
        const response = await authService.login(body)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestBody: IRegistrationBody = req.body
    try {
        const body = schemaValidation(RegistrationBodySchema, requestBody)
        if (body) {
            const response = await authService.registerUser(body)
            if (response) res.status(201).send(formatResponse(response))
        }
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestBody: IActivateUserQuery = req.body
        const body = schemaValidation(ActivateUserQuerySchema, requestBody)
        if (body) {
            const response = await authService.refreshToken(body)
            if (response) res.status(200).send(formatResponse(response))
        }
    } catch (error) {
        next(error)
    }
}
