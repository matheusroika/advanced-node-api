import { FacebookAuthenticationService } from '@/domain/services'
import { makeFacebookApi, makePostgresUserAccountRepository, makeJwtTokenGenerator } from '@/main/factories'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePostgresUserAccountRepository(),
    makeJwtTokenGenerator()
  )
}
