import { adaptExpressRoute } from '@/infra/http'
import { makeFacebookLoginController } from '@/main/factories'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/login/facebook', adaptExpressRoute(makeFacebookLoginController()))
}
