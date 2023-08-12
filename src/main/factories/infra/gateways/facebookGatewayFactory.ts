import { FacebookGateway } from '@/infra/gateways'
import { makeAxiosClient } from '@/main/factories'

export const makeFacebookGateway = (): FacebookGateway => {
  return new FacebookGateway(
    makeAxiosClient(),
    process.env.FACEBOOK_CLIENT_ID as string,
    process.env.FACEBOOK_CLIENT_SECRET as string
  )
}
