import { PostgresUserProfileRepository } from '@/infra/postgres/repositories'

export const makePostgresUserProfileRepository = (): PostgresUserProfileRepository => {
  return new PostgresUserProfileRepository()
}
