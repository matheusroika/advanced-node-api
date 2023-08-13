import { MaxFileSizeError } from '@/application/errors'
import type { Validator } from '.'

export class MaxFileSizeValidator implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly file: Buffer
  ) {}

  validate (): Error | undefined {
    if (this.file.length > this.maxSizeInMb * 1024 * 1024) return new MaxFileSizeError(1)
  }
}
