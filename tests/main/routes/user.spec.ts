import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '@/main/config/app'
import { PostgresUser } from '@/infra/postgres/entities'
import { mockDb } from '@/tests/infra/postgres/helpers'
import type { DataSource } from 'typeorm'
import type { IBackup, IMemoryDb } from 'pg-mem'

describe('User Routes', () => {
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

  describe('DELETE /user/picture', () => {
    test('Should return 403 if no Authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/user/picture')
      expect(status).toBe(403)
    })

    test('Should return 200 with empty body if name is undefined', async () => {
      const { id } = await PostgresUser.save({ email: 'any@email.com' })
      const authorization = jwt.sign({ key: id }, process.env.JWT_SECRET as string)
      const { status, body } = await request(app)
        .delete('/api/user/picture')
        .set({ authorization })
      expect(status).toBe(200)
      expect(body).toEqual({})
    })

    test('Should return 200 with initials if name is valid', async () => {
      const { id } = await PostgresUser.save({ email: 'any@email.com', name: 'any name' })
      const authorization = jwt.sign({ key: id }, process.env.JWT_SECRET as string)
      const { status, body } = await request(app)
        .delete('/api/user/picture')
        .set({ authorization })
      expect(status).toBe(200)
      expect(body).toEqual({ initials: 'AN' })
    })
  })

  describe('PUT /user/picture', () => {
    test('Should return 403 if no Authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/user/picture')
      expect(status).toBe(403)
    })
  })
})
