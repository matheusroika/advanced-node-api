import { RequiredValidator } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors'

describe('Required Validator', () => {
  test('Should return RequireFieldError if value is empty', () => {
    const sut = new RequiredValidator('', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return RequireFieldError if value is undefined', () => {
    const sut = new RequiredValidator(undefined, 'other_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('other_field'))
  })

  test('Should return RequireFieldError if value is null', () => {
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
