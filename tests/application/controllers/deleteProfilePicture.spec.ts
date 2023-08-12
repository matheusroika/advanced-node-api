import { DeleteProfilePictureController } from '@/application/controllers'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { ChangeProfilePicture } from '@/domain/features'

type Sut = {
  sut: DeleteProfilePictureController
  changeProfilePicture: MockProxy<ChangeProfilePicture>
}

const makeSut = (): Sut => {
  const changeProfilePicture = mock<ChangeProfilePicture>()
  const sut = new DeleteProfilePictureController(changeProfilePicture)
  return {
    sut,
    changeProfilePicture
  }
}

describe('Delete Profile Picture Controller', () => {
  test('Should call ChangeProfilePicture with correct params', async () => {
    const { sut, changeProfilePicture } = makeSut()
    await sut.handle({ userId: 'any_user_id' })
    expect(changeProfilePicture.change).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfilePicture.change).toHaveBeenCalledTimes(1)
  })
})
