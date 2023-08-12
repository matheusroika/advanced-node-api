import { SaveProfilePictureController } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'

type Sut = {
  sut: SaveProfilePictureController
}

const makeSut = (): Sut => {
  const sut = new SaveProfilePictureController()
  return {
    sut
  }
}

describe('Save Profile Picture Controller', () => {
  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from('') } })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })
})
