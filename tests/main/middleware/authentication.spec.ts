import request from 'supertest'
import app from '@/main/config/app'
import { ForbiddenError } from '@/application/errors'
import { auth } from '@/main/middlewares'

describe('Authentication Middleware', () => {
  test('Should return 403 if Authorization header is not provided', async () => {
    app.get('/fake_route', auth)

    const { status, body } = await request(app)
      .get('/fake_route')
    expect(status).toBe(403)
    expect(body).toEqual({ error: new ForbiddenError().message })
  })
})
