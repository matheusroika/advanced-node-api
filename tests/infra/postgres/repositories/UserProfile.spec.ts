import { type IBackup, type IMemoryDb } from 'pg-mem'
import type { DataSource } from 'typeorm'
import { PostgresUserProfileRepository } from '@/infra/postgres/repositories'
import { PostgresUser } from '@/infra/postgres/entities'
import { mockDb } from '@/tests/infra/postgres/helpers'

type Sut = {
  sut: PostgresUserProfileRepository
}

const makeSut = (): Sut => {
  const sut = new PostgresUserProfileRepository()
  return {
    sut
  }
}

describe('Postgres User Profile Repository', () => {
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

  describe('SaveUserPicture', () => {
    test('Should update user profile', async () => {
      const { sut } = makeSut()
      const { id } = await PostgresUser.save({ email: 'any@email.com', initials: 'TN' })
      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url' })
      const user = await PostgresUser.findOne({ where: { id } })
      expect(user?.pictureUrl).toBe('any_url')
      expect(user?.initials).toBeNull()
    })

    test('Should update user profile', async () => {
      const { sut } = makeSut()
      const { id } = await PostgresUser.save({ email: 'any@email.com', pictureUrl: 'any_url' })
      await sut.savePicture({ id: id.toString(), initials: 'TN' })
      const user = await PostgresUser.findOne({ where: { id } })
      expect(user?.pictureUrl).toBeNull()
      expect(user?.initials).toBe('TN')
    })
  })

  describe('LoadUserProfile', () => {
    test('Should load user profile', async () => {
      const { sut } = makeSut()
      const { id } = await PostgresUser.save({ email: 'any@email.com', name: 'Any Name' })
      const user = await sut.load({ id: id.toString() })
      expect(user?.name).toBe('Any Name')
    })

    test('Should load user profile if name is undefined', async () => {
      const { sut } = makeSut()
      const { id } = await PostgresUser.save({ email: 'any@email.com' })
      const user = await sut.load({ id: id.toString() })
      expect(user?.name).toBeUndefined()
    })

    test('Should return undefined if user is not found', async () => {
      const { sut } = makeSut()
      const user = await sut.load({ id: '1' })
      expect(user).toBeUndefined()
    })
  })
})
