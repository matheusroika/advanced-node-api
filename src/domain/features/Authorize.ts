export type Authorize = (params: AuthorizeParams) => Promise<AuthorizeResult>

export type AuthorizeParams = {
  token: string
}
export type AuthorizeResult = string
