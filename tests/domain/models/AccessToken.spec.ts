import { AccessToken } from '@/domain/models'

describe('Access Token Model', () => {
  test('Should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value' })
  })
})
