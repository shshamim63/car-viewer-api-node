import { IAuthenticatedUser, IUser } from '../model/user.model'
import { AuthenticatedUserSchema } from '../schema/user/user.schema'

export const convertToUserResponse = (data: IUser): IAuthenticatedUser => {
    return AuthenticatedUserSchema.parse(data)
}
