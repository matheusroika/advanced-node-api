import { MimeTypeValidator } from '@/application/validation'
import { InvalidMimeTypeError } from '@/application/errors'

describe('Mime Type Validator', () => {
  test('Should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new MimeTypeValidator(['png'], 'image/jpg')
    const error = sut.validate()
    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})
