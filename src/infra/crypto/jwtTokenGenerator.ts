import jwt from 'jsonwebtoken'
import type { TokenGenerator } from '@/domain/contracts/crypto'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const { key, validTimeInMs } = params
    const token = jwt.sign({ key }, this.secret, { expiresIn: validTimeInMs })
    return token
  }
}
