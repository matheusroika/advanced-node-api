import { SaveProfilePictureController } from '@/application/controllers'
import { InvalidMimeTypeError, RequiredFieldError } from '@/application/errors'

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
  const buffer = Buffer.from('any_buffer')
  const mimeType = 'image/png'

  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined as any })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null as any })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file type is invalid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })
})
