import { Controller } from '.'
import { ValidationBuilder, type Validator } from '@/application/validation'
import type { FacebookAuthentication } from '@/domain/features'
import { type HttpResponse, unauthorized, ok } from '@/application/helpers'

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
    try {
      const accessToken = await this.facebookAuth.auth({ token: httpRequest.token as string })
      return ok(accessToken)
    } catch (error) {
      return unauthorized()
    }
  }

  override getValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of(httpRequest.token, 'token').required().build()
    ]
  }
}
