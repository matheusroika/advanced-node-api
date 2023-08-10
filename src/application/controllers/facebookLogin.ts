import { AuthenticationError } from '@/domain/errors'
import { RequiredFieldError } from '@/application/errors'
import type { FacebookAuthentication } from '@/domain/features'
import { type HttpResponse, badRequest, unauthorized, serverError } from '@/application/helpers'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) return badRequest(new RequiredFieldError('token'))

      const authResult = await this.facebookAuth.auth({ token: httpRequest.token })
      if (authResult instanceof AuthenticationError) return unauthorized()

      return {
        statusCode: 200,
        data: { accessToken: authResult.value }
      }
    } catch (error) {
      const typedError = error as Error
      return serverError(typedError)
    }
  }
}
