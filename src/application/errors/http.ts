export class ServerError extends Error {
  constructor (error?: Error) {
    super('Unexpected Server Error. Try again.')
    this.name = ('ServerError')
    this.stack = error?.stack
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The "${fieldName}" field is required`)
    this.name = ('RequiredFieldError')
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized.')
    this.name = ('UnauthorizedError')
  }
}
