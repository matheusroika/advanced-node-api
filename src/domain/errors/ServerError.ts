export class ServerError extends Error {
  constructor (error?: Error) {
    super('Unexpected Server Error. Try again.')
    this.name = ('ServerError')
    this.stack = error?.stack
  }
}
