import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { LoadUserAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const user = await this.loadFacebookUser.loadUser({ token })
    if (!user) return new AuthenticationError()
    const { email } = user
    await this.loadUserAccountRepository.load({ email })
    return ''
  }
}
