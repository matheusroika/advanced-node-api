import { ExpressRouterAdapter } from '@/infra/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import type { Controller } from '@/application/controllers'

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

  test('Should pass error code and error message through', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({ statusCode: 400, data: new Error('any error') })
    const req = getMockReq()
    const { res } = getMockRes()
    await sut.adapt(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'any error' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should pass another error code and error message through', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({ statusCode: 500, data: new Error('other error') })
    const req = getMockReq()
    const { res } = getMockRes()
    await sut.adapt(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'other error' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
