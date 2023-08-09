import { mock, type MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'

type HttpResponse = {
  statusCode: number
  data: any
}

class FacebookLoginController {
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

class ServerError extends Error {
  constructor (error?: Error) {
    super('Unexpected Server Error. Try again.')
    this.name = ('ServerError')
    this.stack = error?.stack
  }
}

type Sut = {
  sut: FacebookLoginController
  facebookAuth: MockProxy<FacebookAuthentication>
}

const makeSut = (): Sut => {
  const facebookAuth = mock<FacebookAuthentication>()
  facebookAuth.auth.mockResolvedValue(new AccessToken('any_value'))
  const sut = new FacebookLoginController(facebookAuth)
  return {
    sut,
    facebookAuth
  }
}

describe('Facebook Login Controller', () => {
  test('Should return 400 if token is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The "token" field is required')
    })
  })

  test('Should return 400 if token is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: null })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The "token" field is required')
    })
  })

  test('Should return 400 if token is undefined', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: undefined })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The "token" field is required')
    })
  })

  test('Should call FacebookAuthentication with correct params', async () => {
    const { sut, facebookAuth } = makeSut()
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.auth).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.auth).toHaveBeenCalledTimes(1)
  })

  test('Should return 401 if FacebookAuthentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    facebookAuth.auth.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  test('Should return 200 if FacebookAuthentication succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_value' }
    })
  })

  test('Should return 500 if FacebookAuthentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    const error = new Error('Infra Error')
    facebookAuth.auth.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
