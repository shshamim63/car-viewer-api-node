import { NextFunction, Request, Response } from 'express'

import { formatResponse } from '../util/formatResponse'

import * as authService from '../service/auth.service'

export const activateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { query } = req
        const response = await authService.activateAccount(query, next)
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
        const { body: requestBody } = req
        const response = await authService.login(requestBody, next)
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            headers: { refresh_token },
        } = req
        const response = await authService.logout(refresh_token as string, next)
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
    const { body: requestBody } = req
    try {
        const response = await authService.registerUser(requestBody, next)
        if (response) res.status(201).send(formatResponse(response))
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
        const {
            headers: { refresh_token },
        } = req
        const response = await authService.refreshToken(
            refresh_token as string,
            next
        )
        if (response) res.status(200).send(formatResponse(response))
    } catch (error) {
        next(error)
    }
}
