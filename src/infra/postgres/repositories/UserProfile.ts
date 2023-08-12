import { PostgresUser } from '@/infra/postgres/entities'
import type { SaveUserPicture } from '@/domain/contracts/repositories'

export class PostgresUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Params): Promise<void> {
    // @ts-expect-error To set field to empty value must pass null
    await PostgresUser.update({ id: Number(id) }, { pictureUrl: pictureUrl ?? null, initials: initials ?? null })
  }
}
