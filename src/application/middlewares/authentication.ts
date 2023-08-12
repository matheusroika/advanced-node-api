import { RequiredStringValidator } from '@/application/validation'
import { type HttpResponse, forbidden, ok } from '@/application/helpers'
import type { AuthorizeUseCase } from '@/domain/useCases'

type HttpRequest = { authorization: string }
type Data = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: AuthorizeUseCase) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Data>> {
    try {
      if (this.validate({ authorization })) return forbidden()
      const userId = await this.authorize.auth({ token: authorization })
      return ok({ userId })
    } catch (error) {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error !== undefined
  }
}
