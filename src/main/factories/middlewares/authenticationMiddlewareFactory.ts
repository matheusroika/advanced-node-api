import { AuthenticationMiddleware } from '@/application/middlewares'
import { AuthorizeUseCase } from '@/domain/useCases'
import { makeJwtTokenHandler } from '@/main/factories'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(new AuthorizeUseCase(makeJwtTokenHandler()))
}
