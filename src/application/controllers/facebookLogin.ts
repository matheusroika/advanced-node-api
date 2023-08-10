import { AuthenticationError } from '@/domain/errors'
import { ValidationBuilder, ValidationComposite } from '@/application/validation'
import type { FacebookAuthentication } from '@/domain/features'
import { type HttpResponse, badRequest, unauthorized, serverError, ok } from '@/application/helpers'

type HttpRequest = {
  token?: string | null
}

type Data = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Data>> {
    try {
      const error = this.validate(httpRequest)
      if (error) return badRequest(error)
      const authResult = await this.facebookAuth.auth({ token: httpRequest.token as string })
      if (authResult instanceof AuthenticationError) return unauthorized()
      return ok({ accessToken: authResult.value })
    } catch (error) {
      const typedError = error as Error
      return serverError(typedError)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite([
      ...ValidationBuilder.of(httpRequest.token, 'token').required().build()
    ]).validate()
  }
}
