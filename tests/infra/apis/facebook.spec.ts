import { FacebookApi } from '@/infra/apis'
import { mock, type MockProxy } from 'jest-mock-extended'

type Sut = {
  sut: FacebookApi
  httpClient: MockProxy<HttpGetClient>
}

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

const clientId = 'any_client_id'
const clientSecret = 'any_client_secret'

const makeSut = (): Sut => {
  const httpClient = mock<HttpGetClient>()
  const sut = new FacebookApi(httpClient, clientId, clientSecret)
  return {
    sut,
    httpClient
  }
}

describe('Facebook Api', () => {
  test('Should call httpClient.get with correct params', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
