import type { AccessToken } from '@/domain/models'
import type { AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  auth: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
