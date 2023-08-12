export class ServerError extends Error {
  constructor (error?: Error) {
    super('Unexpected Server Error. Try again')
    this.name = ('ServerError')
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = ('UnauthorizedError')
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('Access denied')
    this.name = ('ForbiddenError')
  }
}
