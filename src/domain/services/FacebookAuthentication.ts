import { AccessToken, FacebookAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/domain/contracts/apis'
import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/domain/contracts/repositories'
import type { TokenGenerator } from '@/domain/contracts/crypto'

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
    const generatedToken = await this.crypto.generateToken({ key: id, validTimeInMs: AccessToken.validTimeInMs })
    return new AccessToken(generatedToken)
  }
}
