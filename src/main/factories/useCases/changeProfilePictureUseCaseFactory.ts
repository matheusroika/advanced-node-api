import { ChangeProfilePictureUseCase } from '@/domain/useCases'
import { makeAwsS3FileStorage, makePostgresUserProfileRepository, makeUuidHandler } from '@/main/factories'

export const makeChangeProfilePictureUseCase = (): ChangeProfilePictureUseCase => {
  return new ChangeProfilePictureUseCase(makeAwsS3FileStorage(), makeUuidHandler(), makePostgresUserProfileRepository())
}
