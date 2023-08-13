import type { RequestHandler } from 'express'
import type { Controller } from '@/application/controllers'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const response = await controller.handle({ ...req.body, ...req.locals })
    if (response.statusCode === 200) res.status(200).json(response.data)
    else if (response.statusCode === 204) res.status(204).json(response.data)
    else res.status(response.statusCode).json({ error: response.data.message })
  }
}
