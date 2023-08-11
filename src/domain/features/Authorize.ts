export interface Authorize {
  auth: (params: Authorize.Params) => Promise<void>
}

export namespace Authorize {
  export type Params = {
    token: string
  }
}
