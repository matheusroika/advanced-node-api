import type { ChangeProfilePicture } from '@/domain/features'
import { type HttpResponse, noContent } from '@/application/helpers'
import { Controller } from '.'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  async control ({ userId }: HttpRequest): Promise<HttpResponse<undefined>> {
    await this.changeProfilePicture.change({ userId, file: undefined })
    return noContent()
  }
}
