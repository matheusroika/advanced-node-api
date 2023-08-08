import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

type Sut = {
  sut: FacebookAuthenticationService
  loadFacebookUserStub: LoadFacebookUser
}

export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUser.Params) => Promise<LoadFacebookUser.Result>
}

namespace LoadFacebookUser {
  export type Params = {
    token: string
  }
  export type Result = undefined
}

const mockLoadFacebookUser = (): LoadFacebookUser => {
  class LoadFacebookUserStub implements LoadFacebookUser {
    async loadUser (params: LoadFacebookUser.Params): Promise<LoadFacebookUser.Result> {
      return undefined
    }
  }
  return new LoadFacebookUserStub()
}

const makeSut = (): Sut => {
  const loadFacebookUserStub = mockLoadFacebookUser()
  const sut = new FacebookAuthenticationService(loadFacebookUserStub)
  return {
    sut,
    loadFacebookUserStub
  }
}

describe('Facebook Authentication Service', () => {
  test('Should call LoadFacebookUser with correct params', async () => {
    const { sut, loadFacebookUserStub } = makeSut()
    const loadUserSpy = jest.spyOn(loadFacebookUserStub, 'loadUser')
    await sut.auth({ token: 'any_token' })
    expect(loadUserSpy).toHaveBeenCalledWith({ token: 'any_token' })
  })

  test('Should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    const { sut, loadFacebookUserStub } = makeSut()
    jest.spyOn(loadFacebookUserStub, 'loadUser').mockResolvedValueOnce(undefined)
    const authResult = await sut.auth({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
