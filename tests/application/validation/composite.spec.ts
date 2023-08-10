import { type MockProxy, mock } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): Error | undefined {
    return undefined
  }
}

type Sut = {
  sut: ValidationComposite
  validators: Array<MockProxy<Validator>>
}

const makeSut = (): Sut => {
  const validators = [mock<Validator>(), mock<Validator>()]
  validators.forEach(validator => { validator.validate.mockReturnValueOnce(undefined) })
  const sut = new ValidationComposite(validators)
  return {
    sut,
    validators
  }
}

describe('Validation Composite', () => {
  test('Should return undefined if all Validators returns undefined', () => {
    const { sut } = makeSut()
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
