import { type AllowedExtensions, MaxFileSizeValidator, MimeTypeValidator, RequiredBufferValidator, RequiredValidator, type Validator } from '.'

export class ValidationBuilder {
  private constructor (
    private readonly value: any | undefined | null,
    private readonly fieldName: string,
    private readonly validators: Validator[]
  ) {}

  static of (value: any | undefined | null, fieldName: string): ValidationBuilder {
    return new ValidationBuilder(value, fieldName, [])
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredValidator(this.value, this.fieldName))
    return this
  }

  requiredBuffer (): ValidationBuilder {
    this.validators.push(new RequiredBufferValidator(this.value, this.fieldName))
    return this
  }

  mimeType (allowed: Array<keyof typeof AllowedExtensions>): ValidationBuilder {
    this.validators.push(new MimeTypeValidator(allowed, this.value))
    return this
  }

  maxFileSize (maxSizeInMb: number): ValidationBuilder {
    this.validators.push(new MaxFileSizeValidator(maxSizeInMb, this.value))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
