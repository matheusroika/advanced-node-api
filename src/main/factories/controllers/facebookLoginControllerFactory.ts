import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationUseCase } from '@/main/factories'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationUseCase())
}
