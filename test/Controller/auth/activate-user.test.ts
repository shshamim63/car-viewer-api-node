import request from 'supertest'
import { app } from '../../../src/app'
import mongoose from 'mongoose'

import * as userHelper from '../../../src/helper/user.helper'
import {
    ZodActiveStatusEnum,
    ZodRoleEnum,
} from '../../../src/model/user/user.schema'
import { generateToken } from '../../../src/helper/jwt.helper'
import { authConfig } from '../../../src/config'

describe('activate/user', () => {
    const userId = new mongoose.Types.ObjectId().toString()
    const profileId = new mongoose.Types.ObjectId().toString()

    const userData = {
        avatar: 'https://demo.png',
        createdAt: new Date(),
        email: 'demo15@gmail.com',
        id: userId,
        profileId: profileId,
        role: ZodRoleEnum.Enum.user,
        status: ZodActiveStatusEnum.Enum.Pending,
        updatedAt: new Date(),
        username: 'demo123',
        authorizationType: 'Bearer',
    }

    test('It should throw error when query param does not contain token property', async () => {
        const response = await request(app).post('/activate/user')
        expect(response.error.status).toEqual(400)
    })

    test('it should activate the user account', async () => {
        const userHelperMock = jest
            .spyOn(userHelper, 'findOneUser')
            .mockResolvedValue(userData)
        const findAndUpdateUserByIdMock = jest
            .spyOn(userHelper, 'findAndUpdateUserById')
            .mockResolvedValue(userData)
        const generateAuthenticatedUserInfoMock = jest
            .spyOn(userHelper, 'generateAuthenticatedUserInfo')
            .mockResolvedValueOnce(userData)
        const token = generateToken(userData, authConfig.accessTokenSecret)
        const response = await request(app).post(
            `/activate/user?token=${token}`
        )
        expect(userHelperMock).toHaveBeenCalled()
        expect(findAndUpdateUserByIdMock).toHaveBeenCalled()
        expect(generateAuthenticatedUserInfoMock).toHaveBeenCalled()
        expect(response.status).toEqual(200)
    })

    test('It should throw error when trying to activate the same user', async () => {
        const userHelperMock = jest
            .spyOn(userHelper, 'findOneUser')
            .mockResolvedValue({ ...userData, status: ZodActiveStatusEnum.Enum.Active })
        const token = generateToken(userData, authConfig.accessTokenSecret)
        const response = await request(app).post(
            `/activate/user?token=${token}`
        )
        expect(userHelperMock).toHaveBeenCalled()
        expect(response.error.status).toEqual(400)
    })
})
