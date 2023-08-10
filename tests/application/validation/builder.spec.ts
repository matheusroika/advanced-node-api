import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('Validation Builder', () => {
  test('Should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of('any_value', 'any_field').required().build()
    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_field')])
  })
})
