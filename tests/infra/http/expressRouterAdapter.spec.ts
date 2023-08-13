import { adaptExpressRoute } from '@/infra/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { Controller } from '@/application/controllers'
import type { NextFunction, Request, Response } from 'express'

type Adapter = (req: Request, res: Response, next: NextFunction) => Promise<any>

type Sut = {
  sut: Adapter
  controller: MockProxy<Controller>
}

const makeSut = (): Sut => {
  const controller = mock<Controller>()
  controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } })
  const sut = adaptExpressRoute(controller) as Adapter
  return {
    sut,
    controller
  }
}

describe('Express Router Adapter', () => {
  test('Should call Controller handle with correct request', async () => {
    const { sut, controller } = makeSut()
    const req = getMockReq({ body: { anyBody: 'any_body' }, locals: { anyLocals: 'any_locals' } })
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(controller.handle).toHaveBeenCalledWith({ anyBody: 'any_body', anyLocals: 'any_locals' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call Controller handle with empty request', async () => {
    const { sut, controller } = makeSut()
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call res.status.json if Controller handle returns statusCode 200', async () => {
    const { sut } = makeSut()
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should call res.status.json if Controller handle returns statusCode 204', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({ statusCode: 204, data: {} })
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledWith({})
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should pass error code and error message through', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({ statusCode: 400, data: new Error('any error') })
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'any error' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should pass another error code and error message through', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({ statusCode: 500, data: new Error('other error') })
    const req = getMockReq()
    const { res, next } = getMockRes()
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'other error' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
