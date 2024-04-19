
import { jwtVerifyUser } from '../test/data/user'

const jwt = jest.createMockFromModule('jsonwebtoken')

export const verify = jest.fn().mockReturnValue(jwtVerifyUser)

export default jwt
