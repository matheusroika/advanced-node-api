import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { CreateUserAccountFromFacebookRepository, LoadUserAccountRepository, UpdateUserAccountWithFacebookRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateUserAccountFromFacebookRepository & UpdateUserAccountWithFacebookRepository
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const fbUser = await this.facebookApi.loadUser({ token })
    if (!fbUser) return new AuthenticationError()
    const userAccount = await this.userAccountRepository.load({ email: fbUser.email })
    if (!userAccount) {
      await this.userAccountRepository.createFromFacebook(fbUser)
      return ''
    }
    await this.userAccountRepository.updateWithFacebook({
      id: userAccount.id,
      name: userAccount.name ?? fbUser.name,
      facebookId: fbUser.facebookId
    })
    return ''
  }
}
