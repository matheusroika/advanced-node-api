import { FacebookApi } from '@/infra/apis'
import { makeAxiosClient } from '@/main/factories'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosClient(),
    process.env.FACEBOOK_CLIENT_ID as string,
    process.env.FACEBOOK_CLIENT_SECRET as string
  )
}
