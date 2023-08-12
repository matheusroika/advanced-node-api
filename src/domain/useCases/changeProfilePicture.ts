import type { ChangeProfilePicture } from '@/domain/features'
import type { UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'
import { UserProfile } from '@/domain/entities'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepository: SaveUserPicture & LoadUserProfile
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<ChangeProfilePicture.Result> {
    let pictureUrl: string | undefined
    let name: string | undefined
    if (file) {
      pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: userId }) })
    } else {
      name = (await this.userProfileRepository.load({ id: userId })).name
    }
    const userProfile = new UserProfile(userId)
    userProfile.setPicture({ pictureUrl, name })
    await this.userProfileRepository.savePicture(userProfile)
    return userProfile
  }
}
