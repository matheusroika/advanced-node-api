import { Controller } from '.'
import { type HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, type Validator } from '@/application/validation'
import type { ChangeProfilePicture } from '@/domain/features'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
  userId: string
}
type Data = Error | {
  initials?: string
  pictureUrl?: string
}

export class SaveProfilePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  async control ({ file, userId }: HttpRequest): Promise<HttpResponse<Data>> {
    const result = await this.changeProfilePicture.change({ userId, file: file.buffer })
    return ok(result)
  }

  override getValidators ({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of(file, 'image').required().build(),
      ...ValidationBuilder.of(file.mimeType, 'image mime type').required().mimeType().build(),
      ...ValidationBuilder.of(file.buffer, 'image content').required().requiredBuffer().maxFileSize(1).build()
    ]
  }
}
