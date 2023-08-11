import jwt from 'jsonwebtoken'
import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

type Sut = {
  sut: JwtTokenHandler
  fakeJwt: jest.Mocked<typeof jwt>
}

const makeSut = (): Sut => {
  const sut = new JwtTokenHandler('any_secret')
  const fakeJwt = jwt as jest.Mocked<typeof jwt>
  fakeJwt.sign.mockImplementation(() => 'any_token')
  fakeJwt.verify.mockImplementation(() => ({ key: 'any_key' }))
  return {
    sut,
    fakeJwt
  }
}

describe('JWT Token Handler', () => {
  describe('Token Generator', () => {
    test('Should call jwt.sign with correct params', async () => {
      const { sut, fakeJwt } = makeSut()
      await sut.generateToken({ key: 'any_key', validTimeInMs: 1000 })
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1000 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    test('Should return a token on jwt.sign success', async () => {
      const { sut } = makeSut()
      const token = await sut.generateToken({ key: 'any_key', validTimeInMs: 1000 })
      expect(token).toBe('any_token')
    })

    test('Should throw if jwt.sign throws', async () => {
      const { sut, fakeJwt } = makeSut()
      fakeJwt.sign.mockImplementation(() => { throw new Error('jwt_error') })
      const promise = sut.generateToken({ key: 'any_key', validTimeInMs: 1000 })
      await expect(promise).rejects.toThrow(new Error('jwt_error'))
    })
  })

  describe('Token Validator', () => {
    test('Should call jwt.verify with correct params', async () => {
      const { sut, fakeJwt } = makeSut()
      await sut.validateToken({ token: 'any_token' })
      expect(fakeJwt.verify).toHaveBeenCalledWith('any_token', 'any_secret')
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    test('Should return the key used to sign on jwt.verify success', async () => {
      const { sut } = makeSut()
      const generatedKey = await sut.validateToken({ token: 'any_token' })
      expect(generatedKey).toBe('any_key')
    })
  })
})
