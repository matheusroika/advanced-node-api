import { ChangeProfilePictureUseCase } from '@/domain/useCases'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'

type Sut = {
  sut: ChangeProfilePictureUseCase
  fileStorage: MockProxy<UploadFile>
  crypto: MockProxy<UUIDGenerator>
}

const makeSut = (): Sut => {
  const fileStorage = mock<UploadFile>()
  const crypto = mock<UUIDGenerator>()
  crypto.uuid.mockReturnValue('any_unique_id')
  const sut = new ChangeProfilePictureUseCase(fileStorage, crypto)
  return {
    sut,
    fileStorage,
    crypto
  }
}

describe('Change Profile Picture Use Case', () => {
  test('Should call UploadFile with correct params', async () => {
    const { sut, fileStorage } = makeSut()
    const file = Buffer.from('any_buffer')
    await sut.change({ userId: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
