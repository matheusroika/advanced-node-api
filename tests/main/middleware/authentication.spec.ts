import request from 'supertest'
import jwt from 'jsonwebtoken'
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

  test('Should return 200 if Authorization header is valid', async () => {
    const validToken = jwt.sign({ key: 'any_user_id' }, process.env.JWT_SECRET as string)
    app.get('/fake_route', auth, (req, res) => { res.json(req.locals) })
    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization: validToken })
    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
