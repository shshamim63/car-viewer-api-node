interface JwtModule {
    verify: jest.Mock
    sign: jest.Mock
}

const jwt: JwtModule = jest.createMockFromModule('jsonwebtoken')

jwt.verify = jest.fn()
jwt.sign = jest.fn()
export default jwt
