import { type HttpResponse, badRequest } from '@/application/helpers'
import { InvalidMimeTypeError, RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  file: {
    buffer: Buffer
    mimeType: string
  }
}
type Data = Error

export class SaveProfilePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Data>> {
    if (!file || file.buffer.length === 0) return badRequest(new RequiredFieldError('image'))
    return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
  }
}
