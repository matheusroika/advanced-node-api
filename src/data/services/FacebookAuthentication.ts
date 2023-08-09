import { AccessToken, FacebookAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repositories'
import type { TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookUserAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const facebookData = await this.facebookApi.loadUser({ token })
    if (!facebookData) return new AuthenticationError()
    const userData = await this.userAccountRepository.load({ email: facebookData.email })
    const facebookAccount = new FacebookAccount(facebookData, userData)
    const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)
    await this.crypto.generateToken({ key: id })
    return new AccessToken('')
  }
}
