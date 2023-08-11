import { FacebookAuthenticationUseCase } from '@/domain/useCases'
import { makeFacebookApi, makePostgresUserAccountRepository, makeJwtTokenHandler } from '@/main/factories'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePostgresUserAccountRepository(),
    makeJwtTokenHandler()
  )
}
