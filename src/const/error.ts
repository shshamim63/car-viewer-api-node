export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
}

export const RESPONSE_MESSAGE = {
    SUCCESS: 'Success',
    CREATED: 'Resource created successfully',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    CONFLICT: 'Resource already exist',
}

export const ERROR_DESCCRIPTION = {
    USER_ACTIVE: 'User has an active account',
    INVALID_PASSWORD: 'Password invalid',
    INVALID_TOKEN: 'Invalid token',
    INVALID_TOKEN_ACCESS: 'Accessed the system with invalid token',
}

export const CORS_ERROR_MESSAGE ='The CORS policy for this site does not allow access from the specified origin.'