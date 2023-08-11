import { mock, type MockProxy } from 'jest-mock-extended'
import { AuthorizeUseCase } from '@/domain/useCases'
import type { TokenValidator } from '@/domain/contracts/crypto'

type Sut = {
  sut: AuthorizeUseCase
  crypto: MockProxy<TokenValidator>
}

const makeSut = (): Sut => {
  const crypto = mock<TokenValidator>()
  crypto.validateToken.mockResolvedValue('any_id')
  const sut = new AuthorizeUseCase(crypto)
  return {
    sut,
    crypto
  }
}

describe('Authorize Use Case', () => {
  test('Should call TokenValidator with correct params', async () => {
    const { sut, crypto } = makeSut()
    await sut.auth({ token: 'any_token' })
    expect(crypto.validateToken).toHaveBeenCalledWith({ token: 'any_token' })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  test('Should return the correct userId on TokenValidator success', async () => {
    const { sut } = makeSut()
    const userId = await sut.auth({ token: 'any_token' })
    expect(userId).toBe('any_id')
  })
})
