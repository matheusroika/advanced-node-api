import { MaxFileSizeError } from '@/application/errors'
import type { Validator } from '.'

export class MaxFileSizeValidator implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly file: Buffer
  ) {}

  validate (): Error | undefined {
    const maxSizeInBytes = this.maxSizeInMb * 1024 * 1024
    if (this.file.length > maxSizeInBytes) return new MaxFileSizeError(this.maxSizeInMb)
  }
}
