import { MongoUser, User } from '../interfaces/user.interface'

export const userSerializer = (data: MongoUser): User => {
    return {
        avatar: data.avatar ?? '',
        createdAt: data.createdAt,
        email: data.email,
        id: data._id.toString(),
        role: data.role,
        status: data.status,
        updatedAt: data.updatedAt,
        username: data.username,
    }
}
