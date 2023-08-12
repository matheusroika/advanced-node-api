import { ChangeProfilePictureUseCase } from '@/domain/useCases'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

type Sut = {
  sut: ChangeProfilePictureUseCase
  fileStorage: MockProxy<UploadFile>
  crypto: MockProxy<UUIDGenerator>
  userProfileRepository: MockProxy<SaveUserPicture & LoadUserProfile>
}

const makeSut = (): Sut => {
  const fileStorage = mock<UploadFile>()
  const crypto = mock<UUIDGenerator>()
  const userProfileRepository = mock<SaveUserPicture & LoadUserProfile>()
  fileStorage.upload.mockResolvedValue('any_url')
  crypto.uuid.mockReturnValue('any_unique_id')
  const sut = new ChangeProfilePictureUseCase(fileStorage, crypto, userProfileRepository)
  return {
    sut,
    fileStorage,
    crypto,
    userProfileRepository
  }
}

describe('Change Profile Picture Use Case', () => {
  test('Should call UploadFile and UUIDGenerator with correct params', async () => {
    const { sut, fileStorage, crypto } = makeSut()
    const file = Buffer.from('any_buffer')
    await sut.change({ userId: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(crypto.uuid).toHaveBeenCalledWith({ key: 'any_id' })
    expect(crypto.uuid).toHaveBeenCalledTimes(1)
  })

  test('Should not call UploadFile when file is undefined', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.change({ userId: 'any_id', file: undefined as any })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('Should call SaveUserPicture with correct params', async () => {
    const { sut, userProfileRepository } = makeSut()
    await sut.change({ userId: 'any_id', file: Buffer.from('any_buffer') })
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with correct params when file is undefined', async () => {
    const { sut, userProfileRepository } = makeSut()
    await sut.change({ userId: 'any_id', file: undefined as any })
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined })
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call LoadUserProfile with correct params', async () => {
    const { sut, userProfileRepository } = makeSut()
    await sut.change({ userId: 'any_id', file: undefined as any })
    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
  })
})
