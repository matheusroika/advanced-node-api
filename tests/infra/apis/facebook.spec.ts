import { FacebookApi } from '@/infra/apis'
import { mock, type MockProxy } from 'jest-mock-extended'
import type { HttpGetClient } from '@/infra/http'

type Sut = {
  sut: FacebookApi
  httpClient: MockProxy<HttpGetClient>
}

const clientId = 'any_client_id'
const clientSecret = 'any_client_secret'

const makeSut = (): Sut => {
  const httpClient = mock<HttpGetClient>()
  httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' })
  const sut = new FacebookApi(httpClient, clientId, clientSecret)
  return {
    sut,
    httpClient
  }
}

describe('Facebook Api', () => {
  test('Should call httpClient.get with correct params to get App Token', async () => {
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

  test('Should call httpClient.get with correct params to get Debug Token', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
