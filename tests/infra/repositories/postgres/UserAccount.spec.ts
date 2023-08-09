import { type IBackup, type IMemoryDb, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, type DataSource, BaseEntity } from 'typeorm'
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'
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

type MockDb = {
  db: IMemoryDb
  dataSource: DataSource
}
const mockDb = async (entities: any[]): Promise<MockDb> => {
  const db = newDb()
  fixPgMem(db)

  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await dataSource.initialize()
  await dataSource.synchronize()

  return {
    db,
    dataSource
  }
}

describe('Postgres User Account Repository', () => {
  let dataSource: DataSource
  let db: IMemoryDb
  let backup: IBackup

  beforeAll(async () => {
    const mockedDb = await mockDb([PostgresUser])
    db = mockedDb.db
    dataSource = mockedDb.dataSource
    backup = db.backup()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  afterEach(() => {
    backup.restore()
  })

  describe('Load', () => {
    test('Should return an account if email exists', async () => {
      const { sut } = makeSut()
      await PostgresUser.save({ email: 'any@email.com' })
      const account = await sut.load({ email: 'any@email.com' })
      expect(account).toEqual({ id: '1' })
    })

    test('Should return undefined if email does not exists', async () => {
      const { sut } = makeSut()
      const account = await sut.load({ email: 'any@email.com' })
      expect(account).toBeUndefined()
    })
  })
})
