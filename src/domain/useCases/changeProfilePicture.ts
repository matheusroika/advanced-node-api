import type { ChangeProfilePicture } from '@/domain/features'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { SaveUserPicture } from '@/domain/contracts/repositories'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepository: SaveUserPicture
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<void> {
    let pictureUrl: string | undefined
    if (file) pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: userId }) })
    await this.userProfileRepository.savePicture({ pictureUrl })
  }
}
