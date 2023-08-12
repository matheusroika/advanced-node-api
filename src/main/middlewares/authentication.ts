import { adaptExpressMiddleware } from '@/infra/http'
import { makeAuthenticationMiddleware } from '@/main/factories'

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())
