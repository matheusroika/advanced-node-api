import type { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repositories'
import { PostgresUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const { email } = params
    const user = await PostgresUser.findOne({ where: { email } })
    if (!user) return
    return {
      id: user.id.toString(),
      name: user.name ?? undefined
    }
  }

  async saveWithFacebook (params: SaveFacebookUserAccountRepository.Params): Promise<SaveFacebookUserAccountRepository.Result> {
    const { email, name, facebookId } = params
    await PostgresUser.save({ email, name, facebookId })
    return { id: '' }
  }
}
