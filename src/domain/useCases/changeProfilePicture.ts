import type { ChangeProfilePicture } from '@/domain/features'
import type { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import type { UUIDGenerator } from '@/domain/contracts/crypto'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'
import { UserProfile } from '@/domain/entities'
import { AllowedExtensions } from '@/application/validation'

export class ChangeProfilePictureUseCase implements ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepository: SaveUserPicture & LoadUserProfile
  ) {}

  async change ({ userId, file }: ChangeProfilePicture.Params): Promise<ChangeProfilePicture.Result> {
    let pictureUrl: string | undefined
    let name: string | undefined

    if (file) {
      const filename = this.getFilename(userId, file.mimeType)
      pictureUrl = await this.fileStorage.upload({ file: file.buffer, filename })
    } else {
      name = (await this.userProfileRepository.load({ id: userId }))?.name
    }
    const userProfile = new UserProfile(userId)
    userProfile.setPicture({ pictureUrl, name })
    try {
      await this.userProfileRepository.savePicture(userProfile)
    } catch (error) {
      if (file) {
        const filename = this.getFilename(userId, file.mimeType)
        await this.fileStorage.delete({ filename })
      }
      throw error
    }
    return userProfile
  }

  private getFilename (userId: string, mimeType: string): string {
    const key = this.crypto.uuid({ key: userId })
    const indexOfExtension = Object.values(AllowedExtensions).indexOf(mimeType as AllowedExtensions) // Get index of mimeType based on enum value
    const extension = indexOfExtension === -1 ? 'png' : Object.keys(AllowedExtensions)[indexOfExtension] // If mimeType is not on Allowed list, default is png
    return `${key}.${extension}`
  }
}
