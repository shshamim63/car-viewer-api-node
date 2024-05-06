/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    mode: 'development',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    setupFilesAfterEnv: ['./test/jest.setup.ts'],
    moduleNameMapper: {
        '^jsonwebtoken$': '<rootDir>/__mocks__/jsonwebtoken.ts',
    },
}
