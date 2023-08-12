import { ForbiddenError } from '@/application/errors'
import { type HttpResponse, forbidden } from '@/application/helpers'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden()
  }
}

describe('Authentication Middleware', () => {
  test('Should return 403 if Authorization header is empty', async () => {
    const sut = new AuthenticationMiddleware()
    const httpResponse = await sut.handle({ authorization: '' })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
