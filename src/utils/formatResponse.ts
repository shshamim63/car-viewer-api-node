import { AppResponse } from '../interfaces/response.interface'

export const formatResponse = (message): AppResponse => {
    return {
        data: message,
        version: process.env.APP_VERSION,
    }
}
