import { type LoadFacebookUser } from '@/tests/data/services/FacebookAuthentication.spec'
import type { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser
  ) {}

  async auth (params: FacebookAuthentication.Params): FacebookAuthentication.Result {
    const { token } = params
    await this.loadFacebookUser.loadUser({ token })
    return ''
  }
}
