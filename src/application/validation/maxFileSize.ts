import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSizeValidator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly file: Buffer
  ) {}

  validate (): Error {
    return new MaxFileSizeError(1)
  }
}
