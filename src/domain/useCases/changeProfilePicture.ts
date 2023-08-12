import type { ChangeProfilePicture } from '@/domain/features'
import type { UploadFile } from '@/tests/domain/useCases/changeProfilePicture.spec'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<void> {
    await this.fileStorage.upload({ file, key: userId })
  }
}
