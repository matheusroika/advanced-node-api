import { AccessToken } from '@/domain/entities'

describe('Access Token Model', () => {
  test('Should expire after 30 minutes', () => {
    expect(AccessToken.validTimeInMs).toBe(1800000)
  })
})
