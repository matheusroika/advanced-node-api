import axios from 'axios'
import { AxiosHttpClient } from '@/infra/http'

jest.mock('axios')

type Sut = {
  sut: AxiosHttpClient
  fakeAxios: jest.Mocked<typeof axios>
}

const makeSut = (): Sut => {
  const sut = new AxiosHttpClient()
  const fakeAxios = axios as jest.Mocked<typeof axios>
  fakeAxios.get.mockResolvedValue({ status: 200, data: 'any_data' })
  return {
    sut,
    fakeAxios
  }
}

describe('Axios Http Client', () => {
  describe('GET', () => {
    const url = 'any_url'
    const params = { any: 'any' }

    test('Should call axios.get with correct params', async () => {
      const { sut, fakeAxios } = makeSut()
      await sut.get({ url, params })
      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('Should return correctly on axios.get success', async () => {
      const { sut } = makeSut()
      const result = await sut.get({ url, params })
      expect(result).toEqual('any_data')
    })

    test('Should throw if axios.get throws', async () => {
      const { sut, fakeAxios } = makeSut()
      fakeAxios.get.mockRejectedValueOnce(new Error('axios_error'))
      const promise = sut.get({ url, params })
      await expect(promise).rejects.toThrow(new Error('axios_error'))
    })
  })
})
