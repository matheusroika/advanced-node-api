import { RequiredFieldError } from '@/application/errors'

class RequiredFieldValidator {
  constructor (
    private readonly value: string | undefined | null,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    return new RequiredFieldError('any_field')
  }
}

describe('Required Field Validator', () => {
  test('Should return RequireFieldError if value is empty', () => {
    const sut = new RequiredFieldValidator('', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return RequireFieldError if value is undefined', () => {
    const sut = new RequiredFieldValidator(undefined, 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return RequireFieldError if value is null', () => {
    const sut = new RequiredFieldValidator(null, 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
})
