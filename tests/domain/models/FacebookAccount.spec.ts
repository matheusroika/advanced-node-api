import { FacebookAccount } from '@/domain/models'

describe('Facebook Account Model', () => {
  test('Should create instance with only FacebookData', () => {
    const sut = new FacebookAccount({ name: 'Any Name', email: 'any@email.com', facebookId: 'any_fb_id' })
    expect(sut).toEqual({ name: 'Any Name', email: 'any@email.com', facebookId: 'any_fb_id' })
  })
})
