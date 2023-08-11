import { AuthenticationError } from '@/domain/entities/errors'
import { ValidationBuilder, type Validator } from '@/application/validation'
import type { FacebookAuthentication } from '@/domain/features'
import { type HttpResponse, unauthorized, ok } from '@/application/helpers'
import { Controller } from '.'

type HttpRequest = {
  token?: string | null
}

type Data = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async control (httpRequest: HttpRequest): Promise<HttpResponse<Data>> {
    const authResult = await this.facebookAuth.auth({ token: httpRequest.token as string })
    if (authResult instanceof AuthenticationError) return unauthorized()
    return ok({ accessToken: authResult.value })
  }

  override getValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of(httpRequest.token, 'token').required().build()
    ]
  }
}
