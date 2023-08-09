import jwt from 'jsonwebtoken'
import { JwtTokenGenerator } from '@/infra/crypto'

jest.mock('jsonwebtoken')

type Sut = {
  sut: JwtTokenGenerator
  fakeJwt: jest.Mocked<typeof jwt>
}

const makeSut = (): Sut => {
  const sut = new JwtTokenGenerator('any_secret')
  const fakeJwt = jwt as jest.Mocked<typeof jwt>
  fakeJwt.sign.mockImplementation(() => 'any_token')
  return {
    sut,
    fakeJwt
  }
}

describe('JWT Token Generator', () => {
  test('Should call jwt.sign with correct params', async () => {
    const { sut, fakeJwt } = makeSut()
    await sut.generateToken({ key: 'any_key', validTimeInMs: 1000 })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1000 })
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
