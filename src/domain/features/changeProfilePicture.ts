export interface ChangeProfilePicture {
  change: (params: ChangeProfilePicture.Params) => Promise<void>
}

export namespace ChangeProfilePicture {
  export type Params = {
    userId: string
    file: Buffer
  }

  export type Result = {
    accessToken: string
  }
}
