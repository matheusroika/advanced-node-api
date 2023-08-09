type HttpResponse = {
  statusCode: number
  data: any
}

class FacebookLoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The "token" field is required')
    }
  }
}

type Sut = {
  sut: FacebookLoginController
}

const makeSut = (): Sut => {
  const sut = new FacebookLoginController()
  return {
    sut
  }
}

describe('Facebook Login Controller', () => {
  test('Should return 400 if token is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The "token" field is required')
    })
  })

  test('Should return 400 if token is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: null })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The "token" field is required')
    })
  })
})
