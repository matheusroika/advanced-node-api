import { RequiredFieldError } from '@/application/errors'
import type { Validator } from '.'

export class RequiredValidator implements Validator {
  constructor (
    readonly value: any | undefined | null,
    readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (!this.value) return new RequiredFieldError(this.fieldName)
  }
}

export class RequiredBufferValidator extends RequiredValidator {
  constructor (
    override readonly value: Buffer,
    override readonly fieldName: string
  ) {
    super(value, fieldName)
  }

  validate (): Error | undefined {
    if (super.validate() ?? this.value.length <= 0) return new RequiredFieldError(this.fieldName)
  }
}
