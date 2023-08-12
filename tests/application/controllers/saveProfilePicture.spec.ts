import { SaveProfilePictureController } from '@/application/controllers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'

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
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should return 400 if file size is bigger than 1MB', async () => {
    const { sut } = makeSut()
    const invalidBuffer = Buffer.from(new ArrayBuffer(2 * 1024 * 1024)) // 2MB
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType } })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(1)
    })
  })
})
