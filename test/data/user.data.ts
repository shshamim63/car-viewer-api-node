import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

import { SALTROUNDS } from '../../src/const'
import {
    MongoRefreshToken,
    MongoUser,
    SignupRequestBody,
    UserRole,
    UserStatus,
} from '../../src/interfaces/user.interface'
import { Types } from 'mongoose'
import { string } from 'zod'

export const invalidSchemaMessage = 'Invalid Schema'

export const generateSignupRequestBody = (): SignupRequestBody => {
    const password = faker.internet.password()
    return {
        email: faker.internet.email(),
        password,
        avatar: faker.image.avatar(),
        username: faker.string.alphanumeric(10),
        confirmPassword: password,
    }
}

export const mongodbUser = async (): Promise<MongoUser> => {
    const password = faker.internet.password({ length: 15 })
    const passwordHash = await bcrypt.hash(password, SALTROUNDS)

    const userSeed: MongoUser = {
        status: UserStatus.Inactive,
        avatar: faker.image.avatar(),
        createdAt: new Date(),
        email: faker.internet.email(),
        _id: new Types.ObjectId(faker.database.mongodbObjectId()),
        role: UserRole.Admin,
        updatedAt: new Date(),
        username: faker.string.alphanumeric(10),
        passwordHash: passwordHash,
    }

    return userSeed
}

export const mongoRefreshToken = (token) => {
    const refreshTokenSeed: MongoRefreshToken = {
        _id: new Types.ObjectId(faker.database.mongodbObjectId()),
        userId: new Types.ObjectId(faker.database.mongodbObjectId()),
        token: token,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }
    return refreshTokenSeed
}

export const tokenPayload = () => {
    return {
        status: UserStatus.Inactive,
        avatar: faker.image.avatar(),
        createdAt: new Date(),
        email: faker.internet.email(),
        id: faker.database.mongodbObjectId(),
        role: UserRole.Admin,
        updatedAt: new Date(),
        username: faker.string.alphanumeric(10),
    }
}

export const generateLoginCredentials = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}
