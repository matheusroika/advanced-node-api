import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidator {
  constructor (
    private readonly value: string | undefined | null,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value) return
    return new RequiredFieldError(this.fieldName)
  }
}

describe('Required Field Validator', () => {
  test('Should return RequireFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('Should return RequireFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined, 'other_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('other_field'))
  })

  test('Should return RequireFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null, 'third_field')
    const error = sut.validate()
    expect(error).toEqual(new RequiredFieldError('third_field'))
  })

  test('Should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field')
    const error = sut.validate()
    expect(error).toEqual(undefined)
  })
})
