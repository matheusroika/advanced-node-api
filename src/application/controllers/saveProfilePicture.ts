import { type HttpResponse, badRequest } from '@/application/helpers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import type { ChangeProfilePicture } from '@/domain/features'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
  userId: string
}
type Data = Error

export class SaveProfilePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ file, userId }: HttpRequest): Promise<HttpResponse<Data> | undefined> {
    if (!file || file.buffer.length === 0) return badRequest(new RequiredFieldError('image'))
    const supportedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    if (!supportedTypes.includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg']))
    const maxFileSizeInMb = 1 * 1024 * 1024 // 1MB
    if (file.buffer.length > maxFileSizeInMb) return badRequest(new MaxFileSizeError(1))
    await this.changeProfilePicture.change({ userId, file: file.buffer })
  }
}
