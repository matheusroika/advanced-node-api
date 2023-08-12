import type { ChangeProfilePicture } from '@/domain/features'
import { type HttpResponse, noContent } from '@/application/helpers'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ userId }: HttpRequest): Promise<HttpResponse<undefined>> {
    await this.changeProfilePicture.change({ userId, file: undefined })
    return noContent()
  }
}
