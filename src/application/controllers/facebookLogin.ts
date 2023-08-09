import { AuthenticationError, ServerError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { HttpResponse } from '@/application/helpers'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return {
          statusCode: 400,
          data: new Error('The "token" field is required')
        }
      }

      const authResult = await this.facebookAuth.auth({ token: httpRequest.token })
      if (authResult instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: new AuthenticationError()
        }
      }

      return {
        statusCode: 200,
        data: { accessToken: authResult.value }
      }
    } catch (error) {
      const typedError = error as Error
      return {
        statusCode: 500,
        data: new ServerError(typedError)
      }
    }
  }
}
