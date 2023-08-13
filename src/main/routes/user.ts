import { adaptExpressRoute, adaptMulter } from '@/infra/http'
import { auth } from '@/main/middlewares'
import { makeDeleteProfilePictureController, makeSaveProfilePictureController } from '@/main/factories'
import type { Router } from 'express'

export default (router: Router): void => {
  router.delete('/user/picture', auth, adaptExpressRoute(makeDeleteProfilePictureController()))
  router.put('/user/picture', auth, adaptMulter, adaptExpressRoute(makeSaveProfilePictureController()))
}
