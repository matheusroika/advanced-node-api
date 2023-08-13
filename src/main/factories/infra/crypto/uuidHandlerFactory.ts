import { UUIDHandler } from '@/infra/crypto'

export const makeUuidHandler = (): UUIDHandler => {
  return new UUIDHandler()
}
