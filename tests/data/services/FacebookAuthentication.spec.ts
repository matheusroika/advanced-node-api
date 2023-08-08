import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { CreateUserAccountFromFacebookRepository, LoadUserAccountRepository, UpdateUserAccountWithFacebookRepository } from '@/data/contracts/repositories'

type Sut = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUser>
  userAccountRepository: MockProxy<LoadUserAccountRepository & CreateUserAccountFromFacebookRepository & UpdateUserAccountWithFacebookRepository>
}

const makeSut = (): Sut => {
  const facebookApi = mock<LoadFacebookUser>()
  const userAccountRepository = mock<LoadUserAccountRepository & CreateUserAccountFromFacebookRepository & UpdateUserAccountWithFacebookRepository>()
  facebookApi.loadUser.mockResolvedValue({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  userAccountRepository.load.mockResolvedValue({ id: 'any_id', name: 'Any Name' })
  const sut = new FacebookAuthenticationService(facebookApi, userAccountRepository)
  return {
    sut,
    facebookApi,
    userAccountRepository
  }
}

describe('Facebook Authentication Service', () => {
  test('Should call LoadFacebookUser with correct params', async () => {
    const { sut, facebookApi } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    const { sut, facebookApi } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.auth({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('Should call LoadUserAccountRepository on LoadFacebookUser success', async () => {
    const { sut, userAccountRepository } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any@email.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('Should call CreateUserAccountFromFacebookRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, userAccountRepository } = makeSut()
    userAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'Facebook Name',
      email: 'any@email.com',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  test('Should call UpdateUserAccountWithFacebookRepository on LoadUserAccountRepository success', async () => {
    const { sut, userAccountRepository } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'Any Name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('Should update user account name with the one received from Facebook API if account does not have name', async () => {
    const { sut, userAccountRepository } = makeSut()
    userAccountRepository.load.mockResolvedValue({ id: 'any_id' })
    await sut.auth({ token: 'any_token' })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'Facebook Name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
