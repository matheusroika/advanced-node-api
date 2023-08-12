import type { ChangeProfilePicture } from '@/domain/features'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<void> {
    await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: userId }) })
  }
}
