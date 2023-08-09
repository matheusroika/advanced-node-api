import type { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { PostgresUser } from '@/tests/infra/repositories/postgres/UserAccount.spec'

export class PostgresUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const { email } = params
    const user = await PostgresUser.findOne({ where: { email } })
    if (!user) return
    return {
      id: user.id.toString(),
      name: user.name ?? undefined
    }
  }
}
