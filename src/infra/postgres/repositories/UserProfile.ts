import { PostgresUser } from '@/infra/postgres/entities'
import type { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

export class PostgresUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Params): Promise<void> {
    // @ts-expect-error To set field to empty value must pass null
    await PostgresUser.update({ id: Number(id) }, { pictureUrl: pictureUrl ?? null, initials: initials ?? null })
  }

  async load ({ id }: LoadUserProfile.Params): Promise<LoadUserProfile.Result> {
    const user = await PostgresUser.findOne({ where: { id: Number(id) } })
    return user ? { name: user.name ?? undefined } : undefined
  }
}
