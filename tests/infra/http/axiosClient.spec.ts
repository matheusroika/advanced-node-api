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
    const url = 'any_url'
    const params = { any: 'any' }

    test('Should call axios.get with correct params', async () => {
      const { sut } = makeSut()
      await sut.get({ url, params })
      expect(axios.get).toHaveBeenCalledWith(url, { params })
      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })
})
