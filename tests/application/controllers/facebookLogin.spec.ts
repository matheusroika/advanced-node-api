import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'
import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import { UnauthorizedError } from '@/application/errors'
import type { FacebookAuthentication } from '@/domain/features'

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
  test('Should build correct Validators', async () => {
    const { sut } = makeSut()
    const validators = sut.getValidators({ token: '' })
    expect(validators).toEqual([new RequiredStringValidator('', 'token')])
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
})
