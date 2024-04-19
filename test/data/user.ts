import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

import { SALTROUNDS } from '../../src/const'

export const jwtVerifyUser = {
    status: 'Pending',
    avatar: faker.image.avatar(),
    createdAt: new Date(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    profileId: faker.database.mongodbObjectId(),
    role: 'user',
    updatedAt: new Date(),
    username: faker.internet.userName(),
    passwordHash: bcrypt.hashSync(
        faker.internet.password({ length: 15 }),
        SALTROUNDS
    ),
}

export const generateAuthenticatedUserMockResponse = (email?: string) => {
    return {
        ...generateAccessInfoMockResponse(),
        refreshToken: faker.string.hexadecimal({
            length: 64,
        }),
        ...(email && { email: email }),
    }
}

export const generateAccessInfoMockResponse = () => {
    return {
        email: faker.internet.email(),
        status: 'Pending',
        avatar: faker.image.avatar(),
        createdAt: new Date(),
        id: faker.database.mongodbObjectId(),
        profileId: faker.database.mongodbObjectId(),
        role: 'user',
        updatedAt: new Date(),
        username: faker.internet.userName(),
        accessToken: faker.string.hexadecimal({
            length: 64,
        }),
        authorizationType: 'Bearer',
    }
}
