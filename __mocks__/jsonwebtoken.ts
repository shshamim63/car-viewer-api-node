interface JwtModule {
    verify: jest.Mock
}

const jwt: JwtModule = jest.createMockFromModule('jsonwebtoken')

jwt.verify = jest.fn()

export default jwt
