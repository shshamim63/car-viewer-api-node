import { IAuthenticatedUser, IUser } from '../model/user/user.model'

export const convertToUserResponse = (data: IUser): IAuthenticatedUser => {
    const userInfo = {
        avatar: data.avatar,
        createdAt: data.createdAt,
        email: data.email,
        id: data.id,
        profileId: data.profileId,
        role: data.role,
        status: data.status,
        authorizationType: 'Bearer',
        updatedAt: data.updatedAt,
        username: data.username,
    } as IAuthenticatedUser
    return userInfo
}
