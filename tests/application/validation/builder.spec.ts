import { RequiredValidator, ValidationBuilder } from '@/application/validation'

describe('Validation Builder', () => {
  test('Should return a RequiredValidator', () => {
    const validators = ValidationBuilder.of('any_value', 'any_field').required().build()
    expect(validators).toEqual([new RequiredValidator('any_value', 'any_field')])
  })
})
