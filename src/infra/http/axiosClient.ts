import axios from 'axios'
import type { HttpGetClient } from '@/infra/http'

export class AxiosHttpClient {
  async get <Result = any> (args: HttpGetClient.Params): Promise<Result> {
    const { url, params } = args
    const result = await axios.get(url, { params })
    return result.data
  }
}
