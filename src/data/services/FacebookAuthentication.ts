import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    await this.loadFacebookUser.loadUser({ token })
    return new AuthenticationError()
  }
}
