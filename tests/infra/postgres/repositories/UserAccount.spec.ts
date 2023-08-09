import { type IBackup, type IMemoryDb } from 'pg-mem'
import type { DataSource } from 'typeorm'
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'
import { PostgresUser } from '@/infra/postgres/entities'
import { mockDb } from '@/tests/infra/postgres/helpers'

type Sut = {
  sut: PostgresUserAccountRepository
}

const makeSut = (): Sut => {
  const sut = new PostgresUserAccountRepository()
  return {
    sut
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

  describe('SaveWithFacebook', () => {
    test('Should create an account if id is undefined', async () => {
      const { sut } = makeSut()
      await sut.saveWithFacebook({ email: 'any@email.com', name: 'Facebook Name', facebookId: 'any_fb_id' })
      const postgresUser = await PostgresUser.findOne({ where: { email: 'any@email.com' } })
      expect(postgresUser?.id).toBe(1)
    })
  })
})
