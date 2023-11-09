import { IResponse } from '../model/response/response.model'

export const formatResponse = (message: IResponse) => {
    return {
        message: message,
        version: process.env.APP_VERSION,
    }
}
