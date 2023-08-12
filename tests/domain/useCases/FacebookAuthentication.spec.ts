import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { FacebookAuthenticationUseCase } from '@/domain/useCases'
import { AuthenticationError } from '@/domain/entities/errors'
import type { LoadFacebookUser } from '@/domain/contracts/gateways'
import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/domain/contracts/repositories'
import type { TokenGenerator } from '@/domain/contracts/crypto'

jest.mock('@/domain/entities/FacebookAccount')

type Sut = {
  sut: FacebookAuthenticationUseCase
  facebookGateway: MockProxy<LoadFacebookUser>
  userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookUserAccountRepository>
  crypto: MockProxy<TokenGenerator>
}

const makeSut = (): Sut => {
  const facebookGateway = mock<LoadFacebookUser>()
  const userAccountRepository = mock<LoadUserAccountRepository & SaveFacebookUserAccountRepository>()
  const crypto = mock<TokenGenerator>()
  facebookGateway.loadUser.mockResolvedValue({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  userAccountRepository.load.mockResolvedValue({ id: 'any_id', name: 'Any Name' })
  userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
  crypto.generateToken.mockResolvedValue('any_generated_token')
  const sut = new FacebookAuthenticationUseCase(facebookGateway, userAccountRepository, crypto)
  return {
    sut,
    facebookGateway,
    userAccountRepository,
    crypto
  }
}

describe('Facebook Authentication Use Case', () => {
  test('Should call LoadFacebookUser with correct params', async () => {
    const { sut, facebookGateway } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(facebookGateway.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookGateway.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    const { sut, facebookGateway } = makeSut()
    facebookGateway.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut.auth({ token: 'any_token' })
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('Should call LoadUserAccountRepository on LoadFacebookUser success', async () => {
    const { sut, userAccountRepository } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any@email.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveFacebookUserAccountRepository with a FacebookAccount instance', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    const { sut, userAccountRepository } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('Should call TokenGenerator with correct params', async () => {
    const { sut, crypto } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      validTimeInMs: AccessToken.validTimeInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('Should return an AccessToken on success', async () => {
    const { sut } = makeSut()
    const authResult = await sut.auth({ token: 'any_token' })
    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('Should throw if LoadFacebookUser throws', async () => {
    const { sut, facebookGateway } = makeSut()
    facebookGateway.loadUser.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut.auth({ token: 'any_token' })
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('Should throw if LoadUserAccountRepository throws', async () => {
    const { sut, userAccountRepository } = makeSut()
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_user_error'))
    const promise = sut.auth({ token: 'any_token' })
    await expect(promise).rejects.toThrow(new Error('load_user_error'))
  })

  test('Should throw if SaveFacebookUserAccountRepository throws', async () => {
    const { sut, userAccountRepository } = makeSut()
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.auth({ token: 'any_token' })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, crypto } = makeSut()
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.auth({ token: 'any_token' })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
