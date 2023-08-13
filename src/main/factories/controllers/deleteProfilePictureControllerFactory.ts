import { DeleteProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePictureUseCase } from '@/main/factories'

export const makeDeleteProfilePictureController = (): DeleteProfilePictureController => {
  return new DeleteProfilePictureController(makeChangeProfilePictureUseCase())
}
