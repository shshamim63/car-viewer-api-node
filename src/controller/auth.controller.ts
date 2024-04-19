import { NextFunction, Request, Response } from 'express'

import { formatResponse } from '../util/formatResponse'

import * as authService from '../service/auth.service'

// export const activateUserAccount = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const requestQuery: IActivateUserQuery = req.query
//         const data = schemaValidation(ActivateUserQuerySchema, requestQuery)
//         const response = await authService.activateUserAccount(data, next)
//         if (response) res.status(200).send(formatResponse(response))
//     } catch (error) {
//         next(error)
//     }
// }

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

// export const logout = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const headers = req.headers
//         const currentHeaders = schemaValidation(LogoutHeaderSchema, headers)
//         const response = await authService.logout(
//             currentHeaders.refresh_token as string,
//             next
//         )
//         if (response) res.status(200).send(formatResponse(response))
//     } catch (error) {
//         next(error)
//     }
// }
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

// export const refreshToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const headers = req.headers
//         const currentHeader = schemaValidation(ActivateUserQuerySchema, headers)
//         if (currentHeader) {
//             const response = await authService.refreshToken(
//                 currentHeader.token as string,
//                 next
//             )
//             if (response) res.status(200).send(formatResponse(response))
//         }
//     } catch (error) {
//         next(error)
//     }
// }
