import axios from 'axios'
import type { HttpGetClient } from '@/infra/http'

export class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    const { url, params } = args
    await axios.get(url, { params })
  }
}
