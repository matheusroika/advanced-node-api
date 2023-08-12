import { ForbiddenError } from '@/application/errors'
import { type HttpResponse, forbidden } from '@/application/helpers'
import type { AuthorizeUseCase } from '@/domain/useCases'
import { type MockProxy, mock } from 'jest-mock-extended'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  constructor (private readonly authorize: AuthorizeUseCase) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    try {
      const error = new RequiredStringValidator(authorization, 'authorization').validate()
      if (error) return forbidden()
      await this.authorize.auth({ token: authorization })
    } catch (error) {
      return forbidden()
    }
  }
}

type Sut = {
  sut: AuthenticationMiddleware
  authorize: MockProxy<AuthorizeUseCase>
}

const makeSut = (): Sut => {
  const authorize = mock<AuthorizeUseCase>()
  const sut = new AuthenticationMiddleware(authorize)
  return {
    sut,
    authorize
  }
}

describe('Authentication Middleware', () => {
  test('Should return 403 if Authorization header is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ authorization: '' })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('Should return 403 if Authorization header is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ authorization: null as any })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('Should return 403 if Authorization header is undefined', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ authorization: undefined as any })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('Should call Authorize with correct params', async () => {
    const { sut, authorize } = makeSut()
    await sut.handle({ authorization: 'any_auth_token' })
    expect(authorize.auth).toHaveBeenCalledWith({ token: 'any_auth_token' })
    expect(authorize.auth).toHaveBeenCalledTimes(1)
  })

  test('Should return 403 if Authorize throws', async () => {
    const { sut, authorize } = makeSut()
    authorize.auth.mockRejectedValueOnce(new Error('any error'))
    const httpResponse = await sut.handle({ authorization: 'any_auth_token' })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
