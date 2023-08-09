export interface HttpGetClient {
  get: <Result = any> (params: HttpGetClient.Params) => Promise<Result>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}
