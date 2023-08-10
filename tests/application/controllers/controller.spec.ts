import { mocked } from 'jest-mock'
import { Controller } from '@/application/controllers'
import { ValidationComposite } from '@/application/validation'
import { ServerError } from '@/application/errors'
import type { HttpResponse } from '@/application/helpers'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async control (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  test('Should return 400 if validation fails', async () => {
    const error = new Error('Validation Error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({ validate: jest.fn().mockReturnValueOnce(error) }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const sut = new ControllerStub()
    const httpResponse = await sut.handle('any_value')
    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  test('Should return 500 if control fails', async () => {
    const sut = new ControllerStub()
    const error = new Error('Control Error')
    jest.spyOn(sut, 'control').mockRejectedValueOnce(error)
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('Should return same result as control', async () => {
    const sut = new ControllerStub()
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: 'any_data'
    })
  })
})
