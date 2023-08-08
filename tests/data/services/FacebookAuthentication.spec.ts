import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { LoadUserAccountRepository } from '@/data/contracts/repositories'

type Sut = {
  sut: FacebookAuthenticationService
  loadFacebookUser: MockProxy<LoadFacebookUser>
  loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
}

const makeSut = (): Sut => {
  const loadFacebookUser = mock<LoadFacebookUser>()
  const loadUserAccountRepository = mock<LoadUserAccountRepository>()
  loadFacebookUser.loadUser.mockResolvedValue({ name: 'Any Name', email: 'any@email.com', facebookId: 'any_id' })
  const sut = new FacebookAuthenticationService(loadFacebookUser, loadUserAccountRepository)
  return {
    sut,
    loadFacebookUser,
    loadUserAccountRepository
  }
}

describe('Facebook Authentication Service', () => {
  test('Should call LoadFacebookUser with correct params', async () => {
    const { sut, loadFacebookUser } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(loadFacebookUser.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUser.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    const { sut, loadFacebookUser } = makeSut()
    loadFacebookUser.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.auth({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('Should call LoadUserAccountRepository on LoadFacebookUser success', async () => {
    const { sut, loadUserAccountRepository } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any@email.com' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
})
