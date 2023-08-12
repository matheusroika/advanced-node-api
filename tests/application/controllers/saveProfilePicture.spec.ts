import { type MockProxy, mock } from 'jest-mock-extended'
import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import type { ChangeProfilePicture } from '@/domain/features'

type Sut = {
  sut: SaveProfilePictureController
  changeProfilePicture: MockProxy<ChangeProfilePicture>
}

const makeSut = (): Sut => {
  const changeProfilePicture = mock<ChangeProfilePicture>()
  changeProfilePicture.change.mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  const sut = new SaveProfilePictureController(changeProfilePicture)
  return {
    sut,
    changeProfilePicture
  }
}

describe('Save Profile Picture Controller', () => {
  const buffer = Buffer.from('any_buffer')
  const mimeType = 'image/png'
  const file = { buffer, mimeType }
  const userId = 'any_user_id'

  test('Should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined as any, userId })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null as any, userId })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('image')
    })
  })

  test('Should return 400 if file type is invalid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should not return 400 if file type is valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId })
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])
    })
  })

  test('Should return 400 if file size is bigger than 1MB', async () => {
    const { sut } = makeSut()
    const invalidBuffer = Buffer.from(new ArrayBuffer(2 * 1024 * 1024)) // 2MB
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(1)
    })
  })

  test('Should call ChangeProfilePicture with correct params', async () => {
    const { sut, changeProfilePicture } = makeSut()
    await sut.handle({ file, userId })
    expect(changeProfilePicture.change).toHaveBeenCalledWith({ userId, file: buffer })
    expect(changeProfilePicture.change).toHaveBeenCalledTimes(1)
  })

  test('Should return 200 with valid data', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file, userId })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    })
  })
})
