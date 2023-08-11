import request from 'supertest'
import { PostgresUser } from '@/infra/postgres/entities'
import { mockDb } from '@/tests/infra/postgres/helpers'
import type { DataSource } from 'typeorm'
import type { IBackup, IMemoryDb } from 'pg-mem'
import app from '@/main/config/app'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
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

    const loadUserSpy = jest.fn()
    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    test('Should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_fb_id', name: 'Facebook Name', email: 'any@email.com' })
      await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })
        .expect(200)
    })
  })
})
