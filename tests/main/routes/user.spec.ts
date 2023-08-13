import request from 'supertest'
import app from '@/main/config/app'
import { PostgresUser } from '@/infra/postgres/entities'
import { mockDb } from '@/tests/infra/postgres/helpers'
import type { DataSource } from 'typeorm'
import type { IBackup, IMemoryDb } from 'pg-mem'

describe('User Routes', () => {
  describe('DELETE /user/picture', () => {
    let db: IMemoryDb
    let dataSource: DataSource
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

    test('Should return 403 if no Authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/user/picture')
      expect(status).toBe(403)
    })
  })
})
