import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { CreateUserAccountFromFacebookRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateUserAccountFromFacebookRepository
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const user = await this.facebookApi.loadUser({ token })
    if (!user) return new AuthenticationError()
    await this.userAccountRepository.load({ email: user.email })
    await this.userAccountRepository.createFromFacebook(user)
    return ''
  }
}
