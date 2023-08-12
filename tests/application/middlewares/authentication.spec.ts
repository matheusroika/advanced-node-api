import { AuthenticationMiddleware } from '@/application/middlewares'
import { ForbiddenError } from '@/application/errors'

type Sut = {
  sut: AuthenticationMiddleware
  authorize: jest.Mock
}

const makeSut = (): Sut => {
  const authorize = jest.fn().mockResolvedValue('any_user_id')
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
    expect(authorize).toHaveBeenCalledWith({ token: 'any_auth_token' })
    expect(authorize).toHaveBeenCalledTimes(1)
  })

  test('Should return 403 if Authorize throws', async () => {
    const { sut, authorize } = makeSut()
    authorize.mockRejectedValueOnce(new Error('any error'))
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
