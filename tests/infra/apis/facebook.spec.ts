import { FacebookGateway } from '@/infra/gateways'
import { mock, type MockProxy } from 'jest-mock-extended'
import type { HttpGetClient } from '@/infra/http'

type Sut = {
  sut: FacebookGateway
  httpClient: MockProxy<HttpGetClient>
}

const clientId = 'any_client_id'
const clientSecret = 'any_client_secret'

const makeSut = (): Sut => {
  const httpClient = mock<HttpGetClient>()
  httpClient.get
    .mockResolvedValueOnce({ access_token: 'any_app_token' })
    .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
    .mockResolvedValueOnce({ id: 'any_fb_id', name: 'Facebook Name', email: 'any@email.com' })
  const sut = new FacebookGateway(httpClient, clientId, clientSecret)
  return {
    sut,
    httpClient
  }
}

describe('Facebook Gateway', () => {
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

  test('Should call httpClient.get with correct params to get User Data', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  test('Should return Facebook User Data on success', async () => {
    const { sut } = makeSut()
    const fbUser = await sut.loadUser({ token: 'any_client_token' })
    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'Facebook Name',
      email: 'any@email.com'
    })
  })

  test('Should return undefined if HttpGetClient throws', async () => {
    const { sut, httpClient } = makeSut()
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('Facebook API Error'))
    const fbUser = await sut.loadUser({ token: 'any_client_token' })
    expect(fbUser).toBeUndefined()
  })
})
