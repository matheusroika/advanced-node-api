import type { ChangeProfilePicture } from '@/domain/features'
import { type HttpResponse, ok } from '@/application/helpers'
import { Controller } from '.'

type HttpRequest = { userId: string }
type Data = Error | {
  initials?: string
  pictureUrl?: string
}

export class DeleteProfilePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  async control ({ userId }: HttpRequest): Promise<HttpResponse<Data>> {
    const result = await this.changeProfilePicture.change({ userId, file: undefined })
    return ok(result)
  }
}
