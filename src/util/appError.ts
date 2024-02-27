export class AppError extends Error {
    statusCode: number
    description: any

    constructor(statusCode: number, message: string, description: any = null) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = Error.name
        this.statusCode = statusCode
        this.description = description
        Error.captureStackTrace(this)
    }
}
