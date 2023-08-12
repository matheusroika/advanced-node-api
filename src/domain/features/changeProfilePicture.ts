export interface ChangeProfilePicture {
  change: (params: ChangeProfilePicture.Params) => Promise<ChangeProfilePicture.Result>
}

export namespace ChangeProfilePicture {
  export type Params = {
    userId: string
    file: Buffer
  }

  export type Result = {
    pictureUrl?: string
    initials?: string
  }
}
