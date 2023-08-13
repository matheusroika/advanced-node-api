import { auth } from '@/main/middlewares'
import type { Router } from 'express'

export default (router: Router): void => {
  router.delete('/user/picture', auth)
}
