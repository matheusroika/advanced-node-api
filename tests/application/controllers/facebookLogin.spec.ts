import { mock, type MockProxy } from 'jest-mock-extended'
import { Controller, FacebookLoginController } from '@/application/controllers'
import { RequiredValidator } from '@/application/validation'
import { AuthenticationError } from '@/domain/entities/errors'
import { UnauthorizedError } from '@/application/errors'
import type { FacebookAuthentication } from '@/domain/features'

type Sut = {
  sut: FacebookLoginController
  facebookAuth: MockProxy<FacebookAuthentication>
}

const makeSut = (): Sut => {
  const facebookAuth = mock<FacebookAuthentication>()
  facebookAuth.auth.mockResolvedValue({ accessToken: 'any_value' })
  const sut = new FacebookLoginController(facebookAuth)
  return {
    sut,
    facebookAuth
  }
}

describe('Facebook Login Controller', () => {
  test('Should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should build correct Validators', async () => {
    const { sut } = makeSut()
    const validators = sut.getValidators({ token: '' })
    expect(validators).toEqual([new RequiredValidator('', 'token')])
  })

  test('Should call FacebookAuthentication with correct params', async () => {
    const { sut, facebookAuth } = makeSut()
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.auth).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.auth).toHaveBeenCalledTimes(1)
  })

  test('Should return 401 if FacebookAuthentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    facebookAuth.auth.mockRejectedValueOnce(new AuthenticationError())
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
