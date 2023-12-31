import { RequiredValidator } from '@/application/validation'
import { type HttpResponse, forbidden, ok } from '@/application/helpers'
import type { Middleware } from '.'
import type { Authorize } from '@/domain/features'

type HttpRequest = { authorization: string }
type Data = Error | { userId: string }

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Data>> {
    try {
      if (this.validate({ authorization })) return forbidden()
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch (error) {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredValidator(authorization, 'authorization').validate()
    return error !== undefined
  }
}
