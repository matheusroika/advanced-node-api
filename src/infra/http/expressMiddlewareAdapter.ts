import type { RequestHandler } from 'express'
import type { Middleware } from '@/application/middlewares'

export const adaptExpressMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    if (statusCode !== 200) res.status(statusCode).json({ error: data.message })
    else {
      const truthyData = Object.entries(data).filter(entry => entry[1]) // entry[0] = key, entry[1] = value
      req.locals = { ...req.locals, ...Object.fromEntries(truthyData) }
      next()
    }
  }
}
