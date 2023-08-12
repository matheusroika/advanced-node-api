import { RequiredBufferValidator, RequiredValidator } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors'

describe('Required Validator', () => {
  test('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredValidator('', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredValidator(undefined, 'other_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('other_field'))
  })

  test('Should return RequiredFieldError if value is null', () => {
    const sut = new RequiredValidator(null, 'third_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('third_field'))
  })

  test('Should return undefined if value is not empty', () => {
    const sut = new RequiredValidator('any_value', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(undefined)
  })
})

describe('Required Buffer Validator', () => {
  test('Should extend RequiredValidator', () => {
    const sut = new RequiredBufferValidator(Buffer.from(''), 'any_field')
    expect(sut).toBeInstanceOf(RequiredValidator)
  })
  test('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBufferValidator(Buffer.from(''), 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return undefined if value is not empty', () => {
    const sut = new RequiredValidator(Buffer.from('any_buffer'), 'any_field')
    const error = sut.validate()
    expect(error).toEqual(undefined)
  })
})
