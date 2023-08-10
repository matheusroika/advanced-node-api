import { RequiredStringValidator, type Validator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[]
  ) {}

  static of (params: { value: string, fieldName: string }): ValidationBuilder {
    const { value, fieldName } = params
    return new ValidationBuilder(value, fieldName, [])
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

describe('Validation Builder', () => {
  test('Should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_field' }).required().build()
    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_field')])
  })
})
