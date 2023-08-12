/* eslint-disable @typescript-eslint/await-thenable */
import { type HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { type MockProxy, mock } from 'jest-mock-extended'

type Adapter = (req: Request, res: Response, next: NextFunction) => Promise<any>

const adaptExpressMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    await middleware.handle({ ...req.headers })
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
})
