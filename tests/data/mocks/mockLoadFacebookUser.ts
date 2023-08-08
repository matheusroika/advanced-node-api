import type { LoadFacebookUser } from '@/data/contracts/apis'

export const mockLoadFacebookUser = (): LoadFacebookUser => {
  class LoadFacebookUserStub implements LoadFacebookUser {
    async loadUser (params: LoadFacebookUser.Params): Promise<LoadFacebookUser.Result> {
      return undefined
    }
  }
  return new LoadFacebookUserStub()
}
