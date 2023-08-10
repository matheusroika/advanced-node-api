import { JwtTokenGenerator } from '@/infra/crypto'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(process.env.JWT_SECRET as string)
}
