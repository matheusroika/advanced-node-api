import { FacebookAuthenticationUseCase } from '@/domain/useCases'
import { makeFacebookGateway, makePostgresUserAccountRepository, makeJwtTokenHandler } from '@/main/factories'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookGateway(),
    makePostgresUserAccountRepository(),
    makeJwtTokenHandler()
  )
}
