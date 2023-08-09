import { newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, type DataSource, BaseEntity } from 'typeorm'
import { PostgresUserAccountRepository } from '@/infra/repositories/postgres'
import { fixPgMem } from './helpers/fixPgMem'

type Sut = {
  sut: PostgresUserAccountRepository
}

const makeSut = (): Sut => {
  const sut = new PostgresUserAccountRepository()
  return {
    sut
  }
}

@Entity({ name: 'users' })
export class PostgresUser extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ nullable: true })
    facebookId?: string
}

describe('Postgres User Account Repository', () => {
  beforeAll(async () => {
    const db = newDb()
    fixPgMem(db)

    const dataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [PostgresUser]
    }) as DataSource
    await dataSource.initialize()
    await dataSource.synchronize()
    await PostgresUser.save({ email: 'existing@email.com' })
  })

  describe('Load', () => {
    test('Should return an account if email exists', async () => {
      const { sut } = makeSut()
      const account = await sut.load({ email: 'existing@email.com' })
      expect(account).toEqual({ id: '1' })
    })
  })
})
