import type { ChangeProfilePicture } from '@/domain/features'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepository: SaveUserPicture & LoadUserProfile
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<void> {
    let pictureUrl: string | undefined
    let initials: string | undefined
    if (file) {
      pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: userId }) })
    } else {
      const { name } = await this.userProfileRepository.load({ id: userId })
      if (name) {
        const nameArray = name.split(' ').map(n => n[0])
        initials = nameArray[0] + nameArray[nameArray.length - 1]
      }
    }
    await this.userProfileRepository.savePicture({ pictureUrl, initials })
  }
}
