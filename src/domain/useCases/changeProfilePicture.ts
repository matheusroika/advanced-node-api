import type { ChangeProfilePicture } from '@/domain/features'
import type { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'
import { UserProfile } from '@/domain/entities'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepository: SaveUserPicture & LoadUserProfile
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<ChangeProfilePicture.Result> {
    let pictureUrl: string | undefined
    let name: string | undefined
    const key = this.crypto.uuid({ key: userId })
    if (file) {
      pictureUrl = await this.fileStorage.upload({ file, key })
    } else {
      name = (await this.userProfileRepository.load({ id: userId })).name
    }
    const userProfile = new UserProfile(userId)
    userProfile.setPicture({ pictureUrl, name })
    try {
      await this.userProfileRepository.savePicture(userProfile)
    } catch (error) {
      await this.fileStorage.delete({ key })
    }
    return userProfile
  }
}
