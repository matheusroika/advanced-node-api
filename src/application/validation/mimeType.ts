import { InvalidMimeTypeError } from '@/application/errors'
import type { Validator } from '.'

export enum AllowedExtensions {
  png = 'image/png',
  jpg = 'image/jpeg',
  jpeg = 'image/jpeg'
}

export class MimeTypeValidator implements Validator {
  constructor (
    private readonly mimeType: string,
    private readonly allowed: Array<keyof typeof AllowedExtensions> = ['jpeg', 'jpg', 'png']
  ) {}

  validate (): Error | undefined {
    let isValid = false
    for (const extension of this.allowed) {
      if (AllowedExtensions[extension] === this.mimeType) isValid = true
    }
    if (!isValid) return new InvalidMimeTypeError(this.allowed)
  }
}
