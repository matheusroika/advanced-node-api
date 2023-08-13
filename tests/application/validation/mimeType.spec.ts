import { MimeTypeValidator } from '@/application/validation'
import { InvalidMimeTypeError } from '@/application/errors'

describe('Mime Type Validator', () => {
  test('Should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new MimeTypeValidator('image/jpg', ['png'])
    const error = sut.validate()
    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  test('Should return undefined if value is valid', () => {
    const sut = new MimeTypeValidator('image/png')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid', () => {
    const sut = new MimeTypeValidator('image/jpeg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid', () => {
    const sut = new MimeTypeValidator('image/jpeg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
