import { RequiredStringValidator, type Validator } from '.'

export class ValidationBuilder {
  private constructor (
    private readonly value: string | undefined | null,
    private readonly fieldName: string,
    private readonly validators: Validator[]
  ) {}

  static of (value: string | undefined | null, fieldName: string): ValidationBuilder {
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
