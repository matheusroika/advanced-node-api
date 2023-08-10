import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'

type Sut = {
  sut: FacebookApi
}

const makeSut = (): Sut => {
  const axiosClient = new AxiosHttpClient()
  const sut = new FacebookApi(
    axiosClient, process.env.FACEBOOK_CLIENT_ID as string, process.env.FACEBOOK_CLIENT_SECRET as string
  )
  return {
    sut
  }
}

describe('Facebook External API', () => {
  test('Should return a Facebook User if token is valid', async () => {
    const { sut } = makeSut()
    const fbUser = await sut.loadUser({ token: process.env.FACEBOOK_USER_TEST_TOKEN as string })
    expect(fbUser).toEqual({
      facebookId: process.env.FACEBOOK_USER_TEST_ID as string,
      email: process.env.FACEBOOK_USER_TEST_EMAIL as string,
      name: process.env.FACEBOOK_USER_TEST_NAME as string
    })
  })

  test('Should return undefined if token is invalid', async () => {
    const { sut } = makeSut()
    const fbUser = await sut.loadUser({ token: 'invalid_token' })
    expect(fbUser).toBeUndefined()
  })
})
