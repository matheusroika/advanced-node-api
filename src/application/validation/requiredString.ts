import { RequiredFieldError } from '@/application/errors'
import type { Validator } from '.'

export class RequiredStringValidator implements Validator {
  constructor (
    private readonly value: string | undefined | null,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value) return
    return new RequiredFieldError(this.fieldName)
  }
}
