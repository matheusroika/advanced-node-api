import type { Authorize } from '@/domain/features'
import type { TokenValidator } from '@/domain/contracts/crypto'

export class AuthorizeUseCase implements Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async auth ({ token }: Authorize.Params): Promise<Authorize.Result> {
    const userId = await this.crypto.validateToken({ token })
    return userId
  }
}