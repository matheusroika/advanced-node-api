import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'
import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { ServerError, UnauthorizedError } from '@/application/errors'
import type { FacebookAuthentication } from '@/domain/features'

jest.mock('@/application/validation/composite')

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
  test('Should return 400 if validation fails', async () => {
    const error = new Error('Validation Error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({ validate: jest.fn().mockReturnValueOnce(error) }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: '' })
    expect(ValidationComposite).toHaveBeenCalledWith([new RequiredStringValidator('', 'token')])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
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
      data: new UnauthorizedError()
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
