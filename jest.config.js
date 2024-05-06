/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
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
