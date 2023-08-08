export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined
}

export interface CreateUserAccountFromFacebookRepository {
  createFromFacebook: (params: CreateUserAccountFromFacebookRepository.Params) => Promise<void>
}

export namespace CreateUserAccountFromFacebookRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
}
