import multer from 'multer'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { adaptMulter } from '@/infra/http'
import { ServerError } from '@/application/errors'

jest.mock('multer')

describe('Multer Adapter', () => {
  const multerSpy = multer as unknown as jest.Mock
  const uploadSpy = jest.fn()
  const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
  multerSpy.mockImplementation(() => ({
    single: singleSpy
  }))
  const req = getMockReq({ locals: { anyLocals: 'any_locals' } })
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

  test('Should return 500 if upload fails', () => {
    const error = new Error('multer error')
    uploadSpy.mockImplementationOnce((req, res, next) => { next(error) })
    sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error).message })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should not add req.file to req.locals if file is empty', () => {
    uploadSpy.mockImplementationOnce((req, res, next) => { next() })
    sut(req, res, next)
    expect(req.locals).toEqual({ anyLocals: 'any_locals' })
  })
})
