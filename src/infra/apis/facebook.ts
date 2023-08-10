import type { LoadFacebookUser } from '@/data/contracts/apis'
import type { HttpGetClient } from '@/infra/http'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserData = {
  id: string
  name: string
  email: string
}

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUser.Params): Promise<LoadFacebookUser.Result> {
    try {
      const userData = await this.getUserData(params.token)
      return {
        facebookId: userData.id,
        name: userData.name,
        email: userData.email
      }
    } catch (error) {
      return undefined
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const { access_token: appToken } = await this.getAppToken()
    return await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken,
        input_token: clientToken
      }
    })
  }

  private async getUserData (clientToken: string): Promise<UserData> {
    const debugToken = await this.getDebugToken(clientToken)
    return await this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: 'id,name,email',
        access_token: clientToken
      }
    })
  }
}
