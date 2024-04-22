import { tokenPayload } from '../test/data/user'

const jwt = jest.createMockFromModule('jsonwebtoken')

export const verify = jest.fn().mockReturnValue(tokenPayload)

export default jwt
