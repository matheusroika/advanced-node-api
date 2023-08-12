import { InvalidMimeTypeError } from '@/application/errors'

export class MimeTypeValidator {
  constructor (
    private readonly allowed: string[],
    private readonly mimeType: string
  ) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}
