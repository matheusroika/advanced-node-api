import type { AccountData, FacebookData } from '@/domain/entities'

export const mockFacebookData = (): FacebookData => ({
  name: 'Facebook Name',
  email: 'any@email.com',
  facebookId: 'any_fb_id'
})

type MockAccountDataParams = {
  withName: boolean
}

export const mockAccountData = (params?: MockAccountDataParams): AccountData => {
  return params?.withName ? { id: 'any_id', name: 'Any Name' } : { id: 'any_id' }
}
