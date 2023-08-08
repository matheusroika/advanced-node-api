import { FacebookAccount } from '@/domain/models'
import { mockAccountData, mockFacebookData } from '../mocks/mockFacebookAccount'

describe('Facebook Account Model', () => {
  test('Should create instance using only FacebookData', () => {
    const facebookData = mockFacebookData()
    const sut = new FacebookAccount(facebookData)
    expect(sut).toEqual(facebookData)
  })

  test('Should update name if accountData.name is null', () => {
    const facebookData = mockFacebookData()
    const accountData = mockAccountData()
    const sut = new FacebookAccount(facebookData, accountData)
    expect(sut).toEqual({ ...facebookData, ...accountData })
  })

  test('Should not update name if accountData.name is truthy', () => {
    const facebookData = mockFacebookData()
    const accountData = mockAccountData({ withName: true })
    const sut = new FacebookAccount(facebookData, accountData)
    expect(sut).toEqual({ ...facebookData, ...accountData })
  })
})
