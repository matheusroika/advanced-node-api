import { type MockProxy, mock } from 'jest-mock-extended'
import { AuthenticationMiddleware } from '@/application/middlewares'
import { ForbiddenError } from '@/application/errors'
import type { AuthorizeUseCase } from '@/domain/useCases'

type Sut = {
  sut: AuthenticationMiddleware
  authorize: MockProxy<AuthorizeUseCase>
}

const makeSut = (): Sut => {
  const authorize = mock<AuthorizeUseCase>()
  authorize.auth.mockResolvedValue('any_user_id')
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

  test('Should return 200 with userId on Authorize success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ authorization: 'any_auth_token' })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    })
  })
})
