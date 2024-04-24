import { tokenPayload } from '../test/data/user.data'

const jwt = jest.createMockFromModule('jsonwebtoken')

export const verify = jest.fn().mockReturnValue(tokenPayload)

export default jwt
