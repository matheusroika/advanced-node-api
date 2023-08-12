export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The "${fieldName}" field is required`)
    this.name = ('RequiredFieldError')
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Image type not allowed. Supported types: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}
