import { Controller, DeleteProfilePictureController } from '@/application/controllers'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { ChangeProfilePicture } from '@/domain/features'

type Sut = {
  sut: DeleteProfilePictureController
  changeProfilePicture: MockProxy<ChangeProfilePicture>
}

const makeSut = (): Sut => {
  const changeProfilePicture = mock<ChangeProfilePicture>()
  changeProfilePicture.change.mockResolvedValue({ initials: 'any_initials' })
  const sut = new DeleteProfilePictureController(changeProfilePicture)
  return {
    sut,
    changeProfilePicture
  }
}

describe('Delete Profile Picture Controller', () => {
  test('Should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should call ChangeProfilePicture with correct params', async () => {
    const { sut, changeProfilePicture } = makeSut()
    await sut.handle({ userId: 'any_user_id' })
    expect(changeProfilePicture.change).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfilePicture.change).toHaveBeenCalledTimes(1)
  })

  test('Should return 200 with valid data', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials' }
    })
  })
})
