import type { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { Controller } from '@/application/controllers'

class ExpressRouterAdapter {
  constructor (
    private readonly controller: Controller
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const response = await this.controller.handle({ ...req.body })
    res.status(200).json(response.data)
  }
}

type Sut = {
  sut: ExpressRouterAdapter
  controller: MockProxy<Controller>
}

const makeSut = (): Sut => {
  const controller = mock<Controller>()
  controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } })
  const sut = new ExpressRouterAdapter(controller)
  return {
    sut,
    controller
  }
}

describe('Express Router Adapter', () => {
  test('Should call Controller handle with correct request', async () => {
    const { sut, controller } = makeSut()
    const req = getMockReq({ body: { data: 'any_data' } })
    const { res } = getMockRes()
    await sut.adapt(req, res)
    expect(controller.handle).toHaveBeenCalledWith({ data: 'any_data' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call Controller handle with empty request', async () => {
    const { sut, controller } = makeSut()
    const req = getMockReq()
    const { res } = getMockRes()
    await sut.adapt(req, res)
    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call res.status.json if Controller handle returns statusCode 200', async () => {
    const { sut } = makeSut()
    const req = getMockReq()
    const { res } = getMockRes()
    await sut.adapt(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
