import { FacebookAuthenticationService } from '@/data/services'

type Sut = {
  sut: FacebookAuthenticationService
  loadFacebookUserStub: LoadFacebookUser
}

export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUser.Params) => Promise<void>
}

namespace LoadFacebookUser {
  export type Params = {
    token: string
  }
}

const mockLoadFacebookUser = (): LoadFacebookUser => {
  class LoadFacebookUserStub implements LoadFacebookUser {
    async loadUser (params: LoadFacebookUser.Params): Promise<void> {}
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
})
