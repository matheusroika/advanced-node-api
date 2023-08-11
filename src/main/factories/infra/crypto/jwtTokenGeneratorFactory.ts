import { JwtTokenHandler } from '@/infra/crypto'

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(process.env.JWT_SECRET as string)
}
