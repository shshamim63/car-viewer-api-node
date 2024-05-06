import { IResponse } from '../model/response/response.model'

export const formatResponse = (message: IResponse) => {
    return {
        data: message,
        version: process.env.APP_VERSION,
    }
}
