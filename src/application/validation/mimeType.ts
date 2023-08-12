import { InvalidMimeTypeError } from '@/application/errors'
import type { Validator } from '.'

enum AllowedExtensions {
  png = 'image/png',
  jpg = 'image/jpeg',
  jpeg = 'image/jpeg'
}

export class MimeTypeValidator implements Validator {
  constructor (
    private readonly allowed: Array<keyof typeof AllowedExtensions>,
    private readonly mimeType: string
  ) {}

  validate (): Error | undefined {
    for (const extension of this.allowed) {
      if (AllowedExtensions[extension] !== this.mimeType) return new InvalidMimeTypeError(this.allowed)
    }
  }
}
