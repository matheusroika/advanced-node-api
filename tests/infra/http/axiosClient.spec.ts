import axios from 'axios'
import { AxiosHttpClient } from '@/infra/http'

jest.mock('axios')

type Sut = {
  sut: AxiosHttpClient
}

const makeSut = (): Sut => {
  const sut = new AxiosHttpClient()
  return {
    sut
  }
}

describe('Axios Http Client', () => {
  describe('GET', () => {
    test('Should call axios.get with correct params', async () => {
      const { sut } = makeSut()
      await sut.get({
        url: 'any_url',
        params: { any: 'any' }
      })
      expect(axios.get).toHaveBeenCalledWith('any_url', { params: { any: 'any' } })
      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })
})
