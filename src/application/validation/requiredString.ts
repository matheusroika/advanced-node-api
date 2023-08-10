import { RequiredFieldError } from '@/application/errors'

export class RequiredStringValidator {
  constructor (
    private readonly value: string | undefined | null,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value) return
    return new RequiredFieldError(this.fieldName)
  }
}
