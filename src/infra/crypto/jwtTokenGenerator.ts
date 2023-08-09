import jwt from 'jsonwebtoken'
import type { TokenGenerator } from '@/data/contracts/crypto'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<string> {
    const { key, validTimeInMs } = params
    jwt.sign({ key }, this.secret, { expiresIn: validTimeInMs })
    return ''
  }
}
