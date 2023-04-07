import { NextFunction, Request, Response } from 'express'

import * as authService from '../service/auth.service'
import { schemaValidation } from '../util/schemaValidation'
import { formatResponse } from '../util/formatResponse'

import { RegistrationBodySchema } from '../schema/user/user.schema'
import { IRegistrationBody } from '../model/user.model'


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestBody: IRegistrationBody = req.body
    const body = schemaValidation(RegistrationBodySchema, requestBody)
    const response = await authService.registerUser(body)
    console.log('Response')
    if(response) res.send(formatResponse(response)).status(200)  
  } catch (error) {
    next(error)
  }
}
