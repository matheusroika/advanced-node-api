/* eslint-disable @typescript-eslint/await-thenable */
import { type HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { type MockProxy, mock } from 'jest-mock-extended'

type Adapter = (req: Request, res: Response, next: NextFunction) => Promise<any>

const adaptExpressMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    if (statusCode !== 200) res.status(statusCode).json(data)
    else {
      const truthyData = Object.entries(data).filter(entry => entry[1]) // entry[0] = key, entry[1] = value
      req.locals = { ...req.locals, ...Object.fromEntries(truthyData) }
      next()
    }
  }
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

type Sut = {
  sut: Adapter
  middleware: MockProxy<Middleware>
}

const makeSut = (): Sut => {
  const middleware = mock<Middleware>()
  middleware.handle.mockResolvedValue({ statusCode: 200, data: { emptyProps: '', nullProp: null, undefinedProp: undefined, prop: 'any_value' } })
  const sut = adaptExpressMiddleware(middleware) as Adapter
  return {
    sut,
    middleware
  }
}

describe('Express Middleware Adapter', () => {
  test('Should call Middleware.handle with correct request', async () => {
    const { sut, middleware } = makeSut()
    const req = getMockReq({ headers: { any: 'any' } })
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call Middleware.handle with empty request', async () => {
    const { sut, middleware } = makeSut()
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('Should respond with correct error and statusCode', async () => {
    const { sut, middleware } = makeSut()
    middleware.handle.mockResolvedValueOnce({ statusCode: 500, data: { error: 'Any Error' } })
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'Any Error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should respond with other correct error and statusCode', async () => {
    const { sut, middleware } = makeSut()
    middleware.handle.mockResolvedValueOnce({ statusCode: 400, data: { error: 'Other Error' } })
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'Other Error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should add only valid data to req.locals on Middleware.handle success', async () => {
    const { sut } = makeSut()
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
