import { mocked } from 'jest-mock'
import { type MockProxy, mock } from 'jest-mock-extended'
import { ChangeProfilePictureUseCase } from '@/domain/useCases'
import { UserProfile } from '@/domain/entities'
import type { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

jest.mock('@/domain/entities/UserProfile')

type Sut = {
  sut: ChangeProfilePictureUseCase
  fileStorage: MockProxy<UploadFile & DeleteFile>
  crypto: MockProxy<UUIDGenerator>
  userProfileRepository: MockProxy<SaveUserPicture & LoadUserProfile>
}

const makeSut = (): Sut => {
  const fileStorage = mock<UploadFile & DeleteFile>()
  const crypto = mock<UUIDGenerator>()
  const userProfileRepository = mock<SaveUserPicture & LoadUserProfile>()
  fileStorage.upload.mockResolvedValue('any_url')
  crypto.uuid.mockReturnValue('any_unique_id')
  userProfileRepository.load.mockResolvedValue({ name: 'Test Super Name' })
  const sut = new ChangeProfilePictureUseCase(fileStorage, crypto, userProfileRepository)
  return {
    sut,
    fileStorage,
    crypto,
    userProfileRepository
  }
}

describe('Change Profile Picture Use Case', () => {
  const buffer = Buffer.from('any_buffer')
  const mimeType = 'image/png'
  const file = { buffer, mimeType }

  test('Should call UploadFile and UUIDGenerator with correct params', async () => {
    const { sut, fileStorage, crypto } = makeSut()
    await sut.change({ userId: 'any_id', file })
    expect(crypto.uuid).toHaveBeenCalledWith({ key: 'any_id' })
    expect(crypto.uuid).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, filename: 'any_unique_id.png' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('Should call UploadFile with correct params', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.change({ userId: 'any_id', file: { buffer, mimeType: 'image/jpeg' } })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, filename: 'any_unique_id.jpg' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('Should not call UploadFile when file is undefined', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.change({ userId: 'any_id', file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('Should call SaveUserPicture with correct params', async () => {
    const { sut, userProfileRepository } = makeSut()
    userProfileRepository.load.mockResolvedValueOnce(undefined)
    await sut.change({ userId: 'any_id', file })
    const userProfileInstance = mocked(UserProfile).mock.instances[0]
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(userProfileInstance)
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call LoadUserProfile with correct params', async () => {
    const { sut, userProfileRepository } = makeSut()
    await sut.change({ userId: 'any_id', file: undefined })
    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
  })

  test('Should not call LoadUserProfile when file is valid', async () => {
    const { sut, userProfileRepository } = makeSut()
    await sut.change({ userId: 'any_id', file })
    expect(userProfileRepository.load).not.toHaveBeenCalled()
  })

  test('Should return correct data on success', async () => {
    const { sut } = makeSut()
    mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn() as any,
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'TN'
    }))
    const result = await sut.change({ userId: 'any_id', file })
    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'TN'
    })
  })

  test('Should call DeleteFile when file is valid and SaveUserPicture throws', async () => {
    const { sut, userProfileRepository, fileStorage } = makeSut()
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(2)
    try {
      await sut.change({ userId: 'any_id', file })
    } catch (error) {
      expect(fileStorage.delete).toHaveBeenCalledWith({ filename: 'any_unique_id.png' })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    }
  })

  test('Should not call DeleteFile when file is not valid and SaveUserPicture throws', async () => {
    const { sut, userProfileRepository, fileStorage } = makeSut()
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(1)
    try {
      await sut.change({ userId: 'any_id', file: undefined })
    } catch (error) {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    }
  })

  test('Should throw if SaveUserPicture throws', async () => {
    const { sut, userProfileRepository } = makeSut()
    const error = new Error('save picture error')
    userProfileRepository.savePicture.mockRejectedValueOnce(error)
    const promise = sut.change({ userId: 'any_id', file: undefined })
    await expect(promise).rejects.toThrow(error)
  })

  test('Should throw if UploadFile throws', async () => {
    const { sut, fileStorage } = makeSut()
    const error = new Error('upload file error')
    fileStorage.upload.mockRejectedValueOnce(error)
    const promise = sut.change({ userId: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })

  test('Should throw if DeleteFile throws', async () => {
    const { sut, fileStorage, userProfileRepository } = makeSut()
    const error = new Error('delete file error')
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error())
    fileStorage.delete.mockRejectedValueOnce(error)
    const promise = sut.change({ userId: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })

  test('Should throw if UUIDGenerator throws', async () => {
    const { sut, crypto } = makeSut()
    const error = new Error('uuid error')
    crypto.uuid.mockImplementationOnce(() => { throw error })
    const promise = sut.change({ userId: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })

  test('Should throw if LoadUserProfile throws', async () => {
    const { sut, userProfileRepository } = makeSut()
    const error = new Error('load user error')
    userProfileRepository.load.mockRejectedValueOnce(error)
    const promise = sut.change({ userId: 'any_id', file: undefined })
    await expect(promise).rejects.toThrow(error)
  })
})
