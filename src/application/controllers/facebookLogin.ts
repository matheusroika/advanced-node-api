import { AuthenticationError } from '@/domain/errors'
import { RequiredFieldError } from '@/application/errors'
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
      if (!httpRequest.token) return badRequest(new RequiredFieldError('token'))
      const authResult = await this.facebookAuth.auth({ token: httpRequest.token })
      if (authResult instanceof AuthenticationError) return unauthorized()
      return ok({ accessToken: authResult.value })
    } catch (error) {
      const typedError = error as Error
      return serverError(typedError)
    }
  }
}
