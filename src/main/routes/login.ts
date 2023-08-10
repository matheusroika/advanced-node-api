import { ExpressRouterAdapter } from '@/infra/http'
import { makeFacebookLoginController } from '@/main/factories'
import type { Router } from 'express'

export default (router: Router): void => {
  const adapter = new ExpressRouterAdapter(makeFacebookLoginController())
  router.post('/login/facebook', adapter.adapt)
}
