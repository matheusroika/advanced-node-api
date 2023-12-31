import { MaxFileSizeValidator } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

describe('Max File Size Validator', () => {
  test('Should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(2 * 1024 * 1024)) // 2MB
    const sut = new MaxFileSizeValidator(1, invalidBuffer)
    const error = sut.validate()
    expect(error).toEqual(new MaxFileSizeError(1))
  })

  test('Should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024)) // 2MB
    const sut = new MaxFileSizeValidator(5, invalidBuffer)
    const error = sut.validate()
    expect(error).toEqual(new MaxFileSizeError(5))
  })

  test('Should return undefined if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(1 * 1024 * 1024)) // 1MB
    const sut = new MaxFileSizeValidator(1, validBuffer)
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
