import { MaxFileSizeValidator } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

describe('Max File Size Validator', () => {
  test('Should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(2 * 1024 * 1024)) // 2MB
    const sut = new MaxFileSizeValidator(1, invalidBuffer)
    const error = sut.validate()
    expect(error).toEqual(new MaxFileSizeError(1))
  })
})
