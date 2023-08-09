import { AccessToken } from '@/domain/models'

describe('Access Token Model', () => {
  test('Should create instance with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value' })
  })

  test('Should expire after 30 minutes', () => {
    expect(AccessToken.validTimeInMs).toBe(1800000)
  })
})
