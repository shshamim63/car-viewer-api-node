import { IAuthenticatedUser, IUser } from '../model/user.model'
import { AuthenticatedUserSchema } from '../schema/user/user.schema'

export const convertToUserResponse = (data: IUser): IAuthenticatedUser => {
    const userinfo = { ...data, _id: data._id.toString() }
    return AuthenticatedUserSchema.parse(userinfo)
}
