import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUser } from '@/domain/contracts/gateways'
import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/domain/contracts/repositories'
import type { TokenGenerator } from '@/domain/contracts/crypto'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly facebookGateway: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookUserAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async auth (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const { token } = params
    const facebookData = await this.facebookGateway.loadUser({ token })
    if (!facebookData) throw new AuthenticationError()
    const userData = await this.userAccountRepository.load({ email: facebookData.email })
    const facebookAccount = new FacebookAccount(facebookData, userData)
    const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)
    const accessToken = await this.crypto.generateToken({ key: id, validTimeInMs: AccessToken.validTimeInMs })
    return { accessToken }
  }
}
