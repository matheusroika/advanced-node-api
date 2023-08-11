import { FacebookAuthenticationUseCase } from '@/domain/useCases'
import { makeFacebookApi, makePostgresUserAccountRepository, makeJwtTokenGenerator } from '@/main/factories'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePostgresUserAccountRepository(),
    makeJwtTokenGenerator()
  )
}
