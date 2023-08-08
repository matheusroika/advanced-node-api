import { FacebookAccount } from '@/domain/models'

describe('Facebook Account Model', () => {
  test('Should create instance using only FacebookData', () => {
    const sut = new FacebookAccount({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' })
    expect(sut).toEqual({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  })

  test('Should update name if accountData.name is null', () => {
    const sut = new FacebookAccount({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' }, { id: 'any_id' })
    expect(sut).toEqual({ id: 'any_id', name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  })

  test('Should not update name if accountData.name is truthy', () => {
    const sut = new FacebookAccount({ name: 'Facebook Name', email: 'any@email.com', facebookId: 'any_fb_id' }, { id: 'any_id', name: 'Any Name' })
    expect(sut).toEqual({ id: 'any_id', name: 'Any Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  })
})
