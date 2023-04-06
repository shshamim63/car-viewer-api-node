import bcrypt from "bcrypt"

import { IRegistrationBody, IUser } from "../model/user.model"
import { User } from "../schema/user/user.mongo.schema"
import { AppError } from "../util/appError"
import { SALTROUNDS } from '../util/constant'

export const registerUser = async (body: IRegistrationBody): Promise<IUser> => {
  const data: IUser = {
      email: body.email,
      passwordHash: await bcrypt.hashSync(body.password, SALTROUNDS),
      username: body.username,
      avatar: body.avatar ?? ''
  }
  try {
    const user = new User(data)
    await user.save()
    return user
  } catch (error) {
    if(error.code === 11000) {
      throw new AppError(400, 'User already exists with the following', error.keyValue)  
    } else {
      throw new AppError(500, 'Server error')
    }
  }
}