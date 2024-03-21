import { ErrorProperty } from '../model/utils/error'
export class AppError extends Error {
    statusCode: number
    description: string | ErrorProperty[] | null

    constructor(
        statusCode: number,
        message: string,
        description?: string | ErrorProperty[] | null
    ) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = Error.name
        this.statusCode = statusCode
        this.description = description
        Error.captureStackTrace(this)
    }
}
