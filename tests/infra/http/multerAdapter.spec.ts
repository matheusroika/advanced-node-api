import multer from 'multer'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { adaptMulter } from '@/infra/http'

jest.mock('multer')

describe('Multer Adapter', () => {
  const multerSpy = multer as unknown as jest.Mock
  const uploadSpy = jest.fn()
  const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
  multerSpy.mockImplementation(() => ({
    single: singleSpy
  }))
  const req = getMockReq()
  const { res, next } = getMockRes()
  const sut = adaptMulter

  test('Should call single upload with correct params', () => {
    sut(req, res, next)
    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('userProfilePicture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})
