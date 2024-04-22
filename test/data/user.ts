import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

import { SALTROUNDS } from '../../src/const'
import {
    MongoUser,
    SignupRequestBody,
    UserRole,
    UserStatus,
} from '../../src/interfaces/user.interface'
import { Types } from 'mongoose'

export const generateSignupRequestBody = (): SignupRequestBody => {
    const password = faker.internet.password()
    return {
        email: faker.internet.email(),
        password,
        avatar: faker.image.avatar(),
        username: faker.internet.userName(),
        confirmPassword: password,
    }
}

export const createUserSeed = async (): Promise<MongoUser> => {
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
        username: faker.internet.userName(),
        passwordHash: passwordHash,
    }

    return userSeed
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
        username: faker.internet.userName(),
    }
}
