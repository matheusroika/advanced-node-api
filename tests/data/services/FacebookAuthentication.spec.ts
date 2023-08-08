import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUser } from '@/data/contracts/apis'

type Sut = {
  sut: FacebookAuthenticationService
  loadFacebookUser: MockProxy<LoadFacebookUser>
}

const makeSut = (): Sut => {
  const loadFacebookUser = mock<LoadFacebookUser>()
  const sut = new FacebookAuthenticationService(loadFacebookUser)
  return {
    sut,
    loadFacebookUser
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
})
