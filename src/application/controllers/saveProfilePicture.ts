import { type HttpResponse, badRequest } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = { file: any }
type Data = Error

export class SaveProfilePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Data>> {
    return badRequest(new RequiredFieldError('image'))
  }
}
