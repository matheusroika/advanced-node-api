import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  async generateToken ({ key, validTimeInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const token = jwt.sign({ key }, this.secret, { expiresIn: validTimeInMs })
    return token
  }

  async validateToken ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
