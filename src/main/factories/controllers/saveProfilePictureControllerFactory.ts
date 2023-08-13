import { SaveProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePictureUseCase } from '@/main/factories'

export const makeSaveProfilePictureController = (): SaveProfilePictureController => {
  return new SaveProfilePictureController(makeChangeProfilePictureUseCase())
}
