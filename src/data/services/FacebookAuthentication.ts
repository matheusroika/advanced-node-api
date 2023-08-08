import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookUserAccountRepository
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const fbUser = await this.facebookApi.loadUser({ token })
    if (!fbUser) return new AuthenticationError()
    const userAccount = await this.userAccountRepository.load({ email: fbUser.email })
    await this.userAccountRepository.saveWithFacebook({
      id: userAccount?.id,
      name: userAccount?.name ?? fbUser.name,
      email: fbUser.email,
      facebookId: fbUser.facebookId
    })
    return ''
  }
}
