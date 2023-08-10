import { ValidationComposite, type Validator } from '@/application/validation'
import { type HttpResponse, badRequest, serverError } from '@/application/helpers'

export abstract class Controller {
  abstract control (httpRequest: any): Promise<HttpResponse>
  getValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)
      if (error) return badRequest(error)
      return await this.control(httpRequest)
    } catch (error) {
      const typedError = error as Error
      return serverError(typedError)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.getValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
