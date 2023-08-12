import { type HttpResponse, badRequest } from '@/application/helpers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
}
type Data = Error

export class SaveProfilePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Data> | undefined> {
    if (!file || file.buffer.length === 0) return badRequest(new RequiredFieldError('image'))
    const supportedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    if (!supportedTypes.includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg']))
    const maxFileSizeInMb = 1 * 1024 * 1024 // 1MB
    if (file.buffer.length > maxFileSizeInMb) return badRequest(new MaxFileSizeError(1))
  }
}
