import { type MockProxy, mock } from 'jest-mock-extended'
import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { MaxFileSizeValidator, MimeTypeValidator, RequiredBufferValidator, RequiredValidator } from '@/application/validation'
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

  test('Should build correct Validators', async () => {
    const { sut } = makeSut()
    const validators = sut.getValidators({ file, userId })
    expect(validators).toEqual([
      new RequiredValidator(file, 'image'),
      new RequiredValidator(mimeType, 'image mime type'),
      new MimeTypeValidator(mimeType),
      new RequiredValidator(buffer, 'image content'),
      new RequiredBufferValidator(buffer, 'image content'),
      new MaxFileSizeValidator(1, buffer)
    ])
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
