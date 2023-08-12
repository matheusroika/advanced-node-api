import { ChangeProfilePictureUseCase } from '@/domain/useCases'
import { type MockProxy, mock } from 'jest-mock-extended'

type Sut = {
  sut: ChangeProfilePictureUseCase
  fileStorage: MockProxy<UploadFile>
}

export interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = {
    file: Buffer
    key: string
  }
}

const makeSut = (): Sut => {
  const fileStorage = mock<UploadFile>()
  const sut = new ChangeProfilePictureUseCase(fileStorage)
  return {
    sut,
    fileStorage
  }
}

describe('Change Profile Picture Use Case', () => {
  test('Should call UploadFile with correct params', async () => {
    const { sut, fileStorage } = makeSut()
    const file = Buffer.from('any_buffer')
    await sut.change({ userId: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
  })
})
