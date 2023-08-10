import { mock } from 'jest-mock-extended'
import { ValidationComposite, type Validator } from '@/application/validation'

describe('Validation Composite', () => {
  test('Should return undefined if all Validators returns undefined', () => {
    const validators = [mock<Validator>(), mock<Validator>()]
    validators.forEach(validator => { validator.validate.mockReturnValueOnce(undefined) })
    const sut = new ValidationComposite(validators)
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  test('Should return only the first Error if multiple Validators returns Error', () => {
    const validators = [mock<Validator>(), mock<Validator>()]
    validators[0].validate.mockReturnValueOnce(new Error('error 1'))
    validators[1].validate.mockReturnValueOnce(new Error('error 2'))
    const sut = new ValidationComposite(validators)
    const error = sut.validate()
    expect(error).toEqual(new Error('error 1'))
  })

  test('Should return an Error if a Validator returns Error', () => {
    const validators = [mock<Validator>(), mock<Validator>()]
    validators[0].validate.mockReturnValueOnce(undefined)
    validators[1].validate.mockReturnValueOnce(new Error('error 2'))
    const sut = new ValidationComposite(validators)
    const error = sut.validate()
    expect(error).toEqual(new Error('error 2'))
  })
})
