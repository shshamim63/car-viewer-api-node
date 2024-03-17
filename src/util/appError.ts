interface ErrorProperty {
    [key: string]: string
}

export class AppError extends Error {
    statusCode: number
    description: string | ErrorProperty | null

    constructor(
        statusCode: number,
        message: string,
        description: ErrorProperty
    ) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = Error.name
        this.statusCode = statusCode
        this.description = description
        Error.captureStackTrace(this)
    }
}
