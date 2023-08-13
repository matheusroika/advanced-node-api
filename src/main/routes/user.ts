import { adaptExpressRoute } from '@/infra/http'
import { auth } from '@/main/middlewares'
import { makeDeleteProfilePictureController } from '@/main/factories'
import type { Router } from 'express'

export default (router: Router): void => {
  router.delete('/user/picture', auth, adaptExpressRoute(makeDeleteProfilePictureController()))
}
