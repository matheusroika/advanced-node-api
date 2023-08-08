export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
  }
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

export interface UpdateUserAccountWithFacebookRepository {
  updateWithFacebook: (params: UpdateUserAccountWithFacebookRepository.Params) => Promise<void>
}

export namespace UpdateUserAccountWithFacebookRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}
