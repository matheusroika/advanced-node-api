import request from 'supertest'
import app from '@/main/config/app'
import { PostgresUser } from '@/infra/postgres/entities'
import { UnauthorizedError } from '@/application/errors'
import { mockDb } from '@/tests/infra/postgres/helpers'
import type { DataSource } from 'typeorm'
import type { IBackup, IMemoryDb } from 'pg-mem'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
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

    const loadUserSpy = jest.fn()
    jest.mock('@/infra/gateways/facebook', () => ({
      FacebookGateway: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    test('Should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_fb_id', name: 'Facebook Name', email: 'any@email.com' })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })
      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    test('Should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })
      expect(status).toBe(401)
      expect(body).toEqual({ error: new UnauthorizedError().message })
    })
  })
})
