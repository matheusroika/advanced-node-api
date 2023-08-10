import type { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { Controller } from '@/application/controllers'

class ExpressRouterAdapter {
  constructor (
    private readonly controller: Controller
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

type Sut = {
  sut: ExpressRouterAdapter
  controller: MockProxy<Controller>
}

const makeSut = (): Sut => {
  const controller = mock<Controller>()
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
  })
})
