import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('Validation Builder', () => {
  test('Should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_field' }).required().build()
    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_field')])
  })
})
